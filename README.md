<!-- Markdown Docs: -->
<!-- https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown -->
<!-- https://daringfireball.net/projects/markdown/basics -->
<!-- https://daringfireball.net/projects/markdown/syntax -->

<!-- [![NPM Version][npm-image]][npm-url] -->
<!-- [![NPM Downloads][downloads-image]][downloads-url] -->
<!-- [![Node.js Version][node-version-image]][node-version-url] -->
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

# Description

On development stage ...

**NodeJS cross-platform and cross-browser business logic framework - Brain of your application.**

The main idea: 90% of the logic of almost any application can be represented as a single tree-like dynamic object that can be serialized, updated to a new version, merged with other versions.

Almost all logic is contained in the computed properties of this object. Each computed property is an independent object. That is, despite the fact that the application logic is in one object, it is divided into very small, independent modules. These modules are connected to the tree-like object like as microcircuits to the motherboard, and are interconnected by other mini-objects - connectors. You can draw a parallel with brain neurons, where each calculated property can be represented as a neuron that takes data from its dependencies (dendrites) and gives the result as a one value (axon).

The value can be anything, including lists, complex objects, etc.

Each calculated property does its best to minimize the number of calculations, caches values, uses deferred and async calculations, time throttling, etc.

Dependency binding is extremely accurate, flexible, and well optimized. With the only restriction that the binding is possible only down of the object tree, otherwise modularity would be violated. But this limitation can be easily circumvented by adding a link to the parent object in child elements.

Such an architecture has already been successfully tested by me on a real C # project and is now redesigned using my experience and more powerful JavaScript and TypeScript features.

<!--

Основная идея: 90% логики практически любого приложения можно представить в виде одного древовидного динамического объекта, который можно сериализовать, обновить до новой версии, слить с другими версиями.

Практически вся логика содержится в вычисляемых свойствах этого объекта. Каждое вычисляемое свойство является независимым объектом. Т.е не смотря на то, что логика приложения находится в одном объекте, она разбита на очень мелкие не зависимые модули. Эти модули подключены к древовидному объекту как микросхемы к материнской плате, и связаны между собой другими мини объектами - коннекторами. Можно провести параллель с нейронами мозга, где каждое вычисляемое свойство можно представить в виде нейрона, которое берет данные из своих зависимостей (дендритов) и выдает результат в виде одного значения (аксона).

Каждое вычисляемое свойство делает все возможное чтобы минимизировать количество вычислений, кэширует значения, использует throttling, и т.д.

Привязка зависимостей является максимально точной, гибкой и хорошо оптимизированной.

Такая архитектура уже успешна проверена мной на реальном проекте на C# и сейчас переработана с использованием моего опыта и более мощных возможностей JavaScript и TypeScript

-->


<!-- ---

[![BrowserStack](https://i.imgur.com/cOdhMed.png)](https://www.browserstack.com/)

--- -->

# License

[CC0-1.0](LICENSE)

[npm-image]: https://img.shields.io/npm/v/tree-state-manager.svg
[npm-url]: https://npmjs.org/package/tree-state-manager
[node-version-image]: https://img.shields.io/node/v/tree-state-manager.svg
[node-version-url]: https://nodejs.org/en/download/
[travis-image]: https://travis-ci.org/NikolayMakhonin/tree-state-manager.svg
[travis-url]: https://travis-ci.org/NikolayMakhonin/tree-state-manager
[coveralls-image]: https://coveralls.io/repos/github/NikolayMakhonin/tree-state-manager/badge.svg?branch=develop
[coveralls-url]: https://coveralls.io/github/NikolayMakhonin/tree-state-manager?branch=develop
[downloads-image]: https://img.shields.io/npm/dm/tree-state-manager.svg
[downloads-url]: https://npmjs.org/package/tree-state-manager
[npm-url]: https://npmjs.org/package/tree-state-manager
