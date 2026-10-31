"""Export the contracts from the same source revisions as the imported guides."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess
import time
import urllib.request

ROOT = Path(__file__).resolve().parent.parent


def run(args, cwd):
    subprocess.run(args, cwd=cwd, check=True, env={**os.environ, "APP_ENV": "local", "DOCS_ENABLED": "true", "MCP_ENABLED": "false"})


def validate_schema(file):
    schema = json.loads(file.read_text(encoding="utf-8"))
    if not schema.get("openapi") or not schema.get("paths"):
        raise RuntimeError(f"Invalid OpenAPI export: {file}")
    print(f"{file.name}: {len(schema['paths'])} API paths")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--python", help="Existing Python environment, otherwise uv installs locked dependencies")
    parser.add_argument("--web-only", action="store_true")
    args = parser.parse_args()
    web = ROOT / ".sources/web/backend"
    target = ROOT / "public/reference/web/openapi.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    if args.python:
        command = [args.python]
    else:
        run(["uv", "sync", "--frozen", "--no-dev"], web)
        command = ["uv", "run", "--no-sync", "python"]
    code = "import json; from pathlib import Path; from main import app; Path(" + repr(str(target)) + ").write_text(json.dumps(app.openapi(), ensure_ascii=False, indent=2), encoding='utf-8')"
    run(command + ["-c", code], web)
    validate_schema(target)
    if args.web_only:
        return
    desktop = ROOT / ".sources/desktop"
    mvn = shutil.which("mvn")
    if not mvn:
        raise RuntimeError("Maven is required")
    maven = [mvn, "-s", str(ROOT / "scripts/maven-settings.xml"), "-B", "-ntp"]
    run(maven + ["package", "-DskipTests", "-pl", "petri-server", "-am"], desktop)
    run(maven + ["javadoc:aggregate", "-DskipTests", "-Ddoclint=none", "-pl", "petri-math,petri-api,petri-model", "-am"], desktop)
    candidates = [desktop / "target/reports/apidocs", desktop / "target/site/apidocs"]
    javadoc = next((p for p in candidates if (p / "index.html").exists()), None)
    if javadoc is None:
        raise RuntimeError("Javadoc did not produce an index")
    shutil.copytree(javadoc, ROOT / "public/reference/java", dirs_exist_ok=True)
    jars = list((desktop / "petri-server/target").glob("*.jar"))
    jar = next(p for p in jars if not p.name.endswith(("-sources.jar", "-javadoc.jar")))
    target = ROOT / "public/reference/desktop/openapi.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    with (ROOT / ".sources/petri-server.log").open("w", encoding="utf-8") as log:
        process = subprocess.Popen(["java", "-Djava.awt.headless=true", "-jar", str(jar), "--server.address=127.0.0.1", "--server.port=18080"], cwd=desktop, stdout=log, stderr=subprocess.STDOUT)
        try:
            for _ in range(90):
                if process.poll() is not None:
                    raise RuntimeError("petri-server stopped before exporting OpenAPI; inspect .sources/petri-server.log")
                try:
                    with urllib.request.urlopen("http://127.0.0.1:18080/openapi.json", timeout=2) as response:
                        target.write_bytes(response.read())
                    break
                except OSError:
                    time.sleep(1)
            else:
                raise RuntimeError("Timed out waiting for petri-server")
            validate_schema(target)
        finally:
            process.terminate()
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait()


if __name__ == "__main__":
    main()
