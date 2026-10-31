---
title: Оберіть інструменти
---

## Моделювання на комп’ютері

**PetriObjModelPaint** є основним настільним застосунком. Створюйте мережі Петрі та Петрі-об’єктні моделі, запускайте симуляцію й аналізуйте статистику. Сервер симуляції не потрібен.

- [Завантажити застосунок](https://github.com/StetsenkoInna/PetriObjModelPaint/releases/latest)
- [Встановлення та інтерфейс](/uk/desktop/docs/desktop-ui/)
- [Петрі-об’єктні моделі](/uk/desktop/docs/petri-object-models/)
- [Підключення MCP](/uk/desktop/docs/desktop-mcp/)

Потрібна Java 23 або новіша. На сторінці випуску доступні пакети для Windows, Linux і macOS.

## Генерація моделі за описом

**Petri Net Sim** є вебсупутником настільного застосунку. Опишіть систему звичайною мовою, згенеруйте модель за допомогою LLM, відредагуйте її у браузері та запустіть симуляцію. Для генерації потрібен власний ключ провайдера LLM.

Найпростіший запуск використовує готовий Docker-образ. Скопіюйте команду з [головної сторінки](/uk/#tools) і відкрийте `http://localhost:6204`.

Для локальної збірки з початкового коду:

```bash
git clone --recurse-submodules https://github.com/sergiorbk/petri-net-sim.git
cd petri-net-sim
docker compose -f docker-compose.allinone.yml up -d --build
```

Остання команда збирає образ і запускає застосунок із каталогу репозиторію.

- [Варіанти запуску](/uk/web/docs/running/)
- [Симуляція та статистика](/uk/web/docs/simulation/)
- [Налаштування](/uk/web/docs/configuration/)
- [Розгортання](/uk/web/docs/deployment/)
- [HTTP API та MCP](/uk/web/docs/integrations/)

## Інтеграція у власні програми

Використовуйте [Java-бібліотеки](/uk/desktop/docs/java-libraries/) для локального рушія симуляції та роботи з PNML або [petri-server](/uk/desktop/docs/petri-server-integration/) для HTTP, SSE та WebSocket.

[Переглянути всі інтеграції](/uk/integrations/).
