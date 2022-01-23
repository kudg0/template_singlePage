# Сборка для верстки одностраничного сайта
![alt text](https://badgen.net/github/release/kudg0/template_singlePage "Releases")

## Подготовка к работе

1. `yarn install`
2. `yarn start`

3. `yarn build` – для получения сжатой сборки проекта в папке `public`

4. `yarn hotfix` – для быстрого пуша сборки на гит с сообщением `hot fix` 

## Структура проекта
```
gulp-template
├── src
│   ├── fonts
│   ├── img
│   ├── js
│   │   ├── helpers
│   │   ├── libs
│   │   └── partials
│   │
│   ├── partials
│   │   └── content
│   │
│   ├── pages
│   │
│   └── sass
│       ├── content
│       ├── helpers
│       └── libs
│    
├── package.json
├── README.md
├── gulpfile.js
├── .babelrc
├── .browserslistrc
├── .prettierrc
├── .prettierignore
└── .gitignore
```

* Корень проекта:
    * ```.babelrc``` — настройки Babel
    * ```.prettierrc``` — настройки Prettier
    * ```.prettierignore``` — запрет изменения файлов Prettier
    * ```.gitignore``` – запрет на отслеживание файлов Git'ом
    * ```package.json``` — список зависимостей
    * ```README.md``` — описание проекта
    * ```gulpfile.js``` — файл конфигурации Gulp
    * ```.browserslistrc``` — файл конфигурации поддерживаемых версий браузеров
    
* Папка ```src``` - используется во время разработки:
    * ```fonts``` – директория для шрифтов

    * ```img``` — директория для изображений

    * ```js``` — директория для js.

    * ```sass``` — директория для sass файлов

    * ```partials``` — директория для html файлов которые добавляются в проекте

    * ```pages``` — директория для html страниц


## Миксины и прочее
Изначально есть пара полезных вещей:
- Все скрипты и стили автоматически инлайнятся в html-ки

- Можно добавлять сколько угодно файлов *js* и *css*, на страницу подключается только `app.js` и `index.css`, поэтому нужно пользоваться конструкциями:
  - `@import '../../global/helpers/_base';` – для **scss**, относительно того, где лежит сам файл из которого вызывается `@import`
  - `//= include 'cases/_base.js'` – для **js**, относительно директории ```.src/js```

- `@include font-face("FuturaPT", "/fonts/FuturaPT-Book", 300);` - позволяет подключать шрифты в 1 строку.
- `get-vw(25px, 1280);` - позволяет получать значение из **px** в **vw**
- `get-vh(25px, 870);` - позволяет получать значение из **px** в **vh**
- `get-percent(25px, 1280);` - позволяет получать значение из **px** в **%**
 
## Верстка
Команды для сборки:
 - `yarn start` запускает сборку и локальный сервер с Hot Reloading
 - `yarn build` запускает сборку и на выходе получаем сборку html с инлайн скриптами и стилиями внутри
 
## PostHTML
Для расстановки правильных переносов используется плагин [PostHTML Richtypo](https://github.com/Grawl/posthtml-richtypo). Для блока в котором вы хотите отформатировать текст необходимо указать атрибут `data-typo`:
```
<p data-typo>Тут текст</p>
```

Для шаблонизации в проекте используется [Gulp PostHTML](https://github.com/posthtml/gulp-posthtml) с плагинами [PostHTML Include](https://github.com/posthtml/posthtml-include) и [PostHTML Expressions](https://github.com/posthtml/posthtml-expressions)

### Добавление файлов
Что бы просто вставить один файл в другой используется конструкция `<include>`, пример кода:
```
<include src="src/partials/header.html"></include>
```

### Компоненты
Для того что бы извне передать в вставляемый файл какие либо данные необходимо использовать директиву `locals`, и передать туда данные в виде JSON объекта, пример кода:
```
<include src="src/partials/head.html" locals='{"title": "Главная страница"}'></include>
```

### Условия
Внутри любого файла можно использовать разные условия, пример кода:
```
<if condition="foo === 'bar'">
  <p>Foo really is bar! Revolutionary!</p>
</if>

<elseif condition="foo === 'wow'">
  <p>Foo is wow, oh man.</p>
</elseif>

<else>
  <p>Foo is probably just foo in the end.</p>
</else>
```

Так же можно использовать конструкцию `switch/case`, пример кода:
```
<switch expression="foo">
  <case n="'bar'">
    <p>Foo really is bar! Revolutionary!</p>
  </case>
  <case n="'wow'">
    <p>Foo is wow, oh man.</p>
  </case>
  <default>
    <p>Foo is probably just foo in the end.</p>
  </default>
</switch>
```

### Циклы
В любом файле так же можно перебирать данные (массивы или объекты) с помощью цикла, пример кода:
#### Массив
```
<each loop="item, index in array">
  <p>{{ index }}: {{ item }}</p>
</each>
```

#### Объект
```
<each loop="value, key in anObject">
  <p>{{ key }}: {{ value }}</p>
</each>
```

Так же не обязательно передавать данные через переменную, их просто можно написать в цикл, пример кода:
```
<each loop="item in [1,2,3]">
  <p>{{ item }}</p>
</each>
```

В цикле вы можете использовать уже готовые переменные для выборки определенных элементов:
* `loop.index` - текущий индекс элемента, начинается с 0
* `loop.remaining` - количество оставшихся до конца итераций
* `loop.first` - булевый указатель, что элемент первый
* `loop.last` - булевый указатель, что элемент последний
* `loop.length` - количество элементов
