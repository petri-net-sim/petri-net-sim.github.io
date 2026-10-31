---
title: API та бібліотеки
---

Оберіть інтеграцію відповідно до того, де має виконуватися симуляція.

| Інструмент | Призначення | Документація |
| --- | --- | --- |
| `petri-math` | Рушій симуляції для Java | [Бібліотеки](/uk/desktop/docs/java-libraries/) |
| `petri-api` | Інтерфейси, події та DTO | [Бібліотеки](/uk/desktop/docs/java-libraries/) |
| `petri-model` | Графові моделі та PNML | [Бібліотеки](/uk/desktop/docs/java-libraries/) |
| `petri-server` | REST, SSE та WebSocket | [Сервер](/uk/desktop/docs/petri-server-integration/) |
| Desktop MCP | Керування відкритим редактором | [Desktop MCP](/uk/desktop/docs/desktop-mcp/) |
| Web API та MCP | Інтеграція Petri Net Sim | [Підключення](/uk/web/docs/integrations/) |
| Ресурси моделювання | Правила, патерни та схеми | [Спільний пакет](/uk/modeling/overview/) |

Java-модулі мають незалежні версії та потребують Java 23 або новішої. Модулі `petri-math`, `petri-api` та `petri-model` використовують ліцензію MIT. Для інших модулів перевіряйте відповідні ліцензії.

## Згенеровані довідники

- [Довідник API та OpenAPI petri-server](/reference/desktop/)
- [Довідник API та OpenAPI Petri Net Sim](/reference/web/)
- [Java API](/reference/java/)

Довідники формуються з коду під час публікації сайту. Інтерактивна документація локального застосунку доступна за `/docs`, якщо її ввімкнено. Для Petri Net Sim актуальні шляхи інтеграцій повертає `GET /api/v1/config`.
