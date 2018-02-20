# Назначение

Плагин предназначен для разработки документов Prelum и получения выходных форматов путем взаимодействия с транслятором Prelum.

Включает в себя следующие функциональные возможности:
- Подсветка языка разметки Prelum;
- Подсказки и автоматическая подстановка структуры ключевых слов и их значений;
- Трансляция документов Prelum в форматы Textile, TeX, PDF и HTML;
- Панель Prelum для индикации процесса трансляции и удобства выбора выходного формата;
- Публикация на внешних ресурсах, реализованных на базе системы управления проектами Redmine.

# Публикация на ресурсах Redmine
## Настройка параметров подключения к внешним ресурсам

Публикация на ресурсах Redmine осуществляется через встроенное API для подключения к которому необходим секретный ключ. Получить секретный ключ можно на странице пользователя по добавочному адресу *my/account*. Например, если адрес системы http://redmine.prelum.ru, то адрес страницы пользователя http://redmine.prelum.ru/my/account.

Добавление сведений о секретном ключе осуществляется в следующем порядке:
1. Перейти в раздел _Atom > Config_ или _File > Config_;
2. В группу prelum/apiKeys добавить параметр host и key следующим образом:

## Подготовка документа к публикации

Перечень ресурсов для публикации документа указывается в блоке *документ* с помощью параметров _redmine-wiki_ или _redmine-issue_.

Например:

```
документ(ГОСТ-19-106-78)
redmine-wiki - http://redmine.prelum.ru/projects/test/wiki/about
redmine-issue - http://redmine.prelum.ru/issues/1000
--
```