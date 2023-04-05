## Задача 3. "Библиотека i18n"  

* Ограничение времени	1 секунда
* Ограничение памяти	64Mb
* Ввод	input.js
* Вывод	output.txt

В целях борьбы с разрастающимся бандлом приложения, вам поставили задачу переписать логику интернационализации в легаси проекте. Чтобы удалить старую библиотеку интернационализации вам нужно написать функцию `getI18nText`, которая будет повторять логику старой библиотеки, но с использованием `Intl API`.
Старый фреймворк имел следующую логику.

### Параметры функции**

```js
/**  
 * @param stringTokens - описание строки которую нужно интернационализировать.  
 * @param variables - значение переменных  
 * @param translations - объект с переводами  
 * @param locale - локаль  
 */  
getI18nText({stringTokens, variables, translations, locale})
```
#### stringTokens
Текст, который нужно интернационализировать, описывается в JSON-like конфиге, в котором могут встретиться следующие сущности:

`#price` - ключ перевода, в данном случае "price"
`$tripDays` - переменная, в данном случае "tripDays"
`@date` - функции, в данном случае "date". Функции описываются как массив в котором на первом месте стоит имя функции, а все остальные значения в массиве это параметры функции.

**Пример:**

```js
    const stringTokens = [  
    "#price",                          // ключ перевода price  
    " ",                               // неизменяемый текст  
    ["@plural", "#day", "$tripDays"],  // функция плюрализации, в которую       передаётся ключ перевода и переменная в качестве числового значения  
    " - ",                             // неизменяемый текст  
    ["@number", "$tripPrice", "USD"]   // функция интернационализации, в которую    передаётся число в качестве переменной и валюта  
];
```

#### variables

Переменные передаются как объект.

**Пример:**

```js
const variables = {  
  tripDays: 10,  
  tripPrice: 56789.01,  
}
translations
Переводы передаются как JSON cо следующей структурой:

const translations = {  
  "ru-RU" : {             // локаль  
    price: "Цена",        // обычный перевод  
    day: {                // c учетом плюральных форм  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
    }  
  },  
  "en-US": {  
      price: "Price",  
      day: {  
          one: " day",  
          other: " days",  
          //...  
        }  
  },  
  //...  
}
```
### Cписок функций которые требуется поддержать
1. `@date`
 - Функция интернационализации даты. Может принимать как число(timestamp), так и строку.
 - Сигнатура: "@date(value)"

**Пример описания функции в конфиге:**

```js
getI18nText({  
  stringTokens: [["@date", 1676561884561]],  
  locale: "ru-RU",  
}) // четверг, 16 февраля 2023 г., 15:38:04 UTC
```

2. `@number`

Функция интернационализации чисел и валюты.
 - Cигнатура: "@number(value, [currency])"

 - Если нет "currency то возвращает отформатированное число
    Если есть "currency то возвращает отформатированное число с валютой

```js
getI18nText({  
  stringTokens: [["@number", 56789.01, "USD"]],  
  locale: "ru-RU",  
}) // 56 789,01 $
```

3. `@plural`

Функция плюрализации.
 - Сигнатура: "@plural(key, number)"
 - Возвращает строку с отформатированным по правилам интернационализации числом и ключом

```js
getI18nText({  
  stringTokens: [["@plural", "#day", "$tripDays"]],  
  variables: { tripDays: 434.5 },  
  translations: {  
    "ru-RU": {  
      day: {  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
      },  
    }  
    // ...  
  },  
  locale: "ru-RU",  
}) // "434,5 дня"
```

4. `@list`

Функция интернационализации перечеслений.
 - Сигнатура: "@list(...args)"
 - Возвращет "conjunction"список.

```js
getI18nText({  
  stringTokens: [["@list", "Motorcycle", "$item", "#bus"]],  
  variables: { item: "Car" },  
  translations: {  
    "en-US": {  
        bus: "Bus",  
    },  
    // ...  
  },  
  locale: "en-US",  
}) // "Motorcycle, Car, and Bus"
```

5. `@relativeTime`

Функция интернационализации относительного времени.
 - Сигнатура: "@relativeTime(value, unit)"

```js
getI18nText({  
  stringTokens: [["@relativeTime", -5, "hours"]],  
  locale: "ru-RU",  
}) // 5 часов назад
```

### Пример работы

```js
const stringTokens = [  
    "#price",  
    " ",  
    ["@plural", "#day", "$tripDays"],  
    " - ",  
    ["@number", "$tripPrice", "USD"]  
];  
 
 
const variables = {  
  tripDays: 10,  
  tripPrice: 56789.01,  
}  
 
const translations = {  
  "ru-RU" : {             // локаль  
    price: "Цена",        // обычный перевод для ключа price  
    day: {                // перевод для ключа day c учетом плюральных форм  
        zero: " дней",  
        one: " день",  
        few: " дня",  
        many: " дней",  
        other: " дней",  
    }  
  },  
  "en-US": {  
      price: "Price",  
      day: {  
          one: " day",  
          other: " days",  
          //...  
        }  
  },  
  //...  
}  

getI18nText({stringTokens, variables, translations, locale: "ru-RU"}) //  "Цена 10 дней - 56 789,01 $"  
getI18nText({stringTokens, variables, translations, locale: "en-US"}) //  "Price 10 days - $56,789.01"
```

### Шаблон кода
```js
module.exports = function getI18nText({ stringTokens, variables, translations, locale }) {  
   // ваш код здесь  
 
  return i18nText // строка  
}
```

**Пример 1**
**Ввод**
```js
module.exports = [
    ["key", " ", "$var", " ", "#translation"],
    { var: 100 },
    {
        "ru-RU": { translation: "тест" },
        "en-US": { translation: "test" },
        "de-DE": { translation: "prüfen" },
        "hi-IN": { translation: "परीक्षा" },
        "ar-AA": { translation: "امتحان" },
    },
]
```
**Вывод**
key 100 тест
key 100 test
key 100 prüfen
key 100 परीक्षा
key 100 امتحان

**Пример 2**
**Ввод**
```js	
module.exports = [
    [["@number", "$var", "USD"]],
    { var: 123456789.0123 },
    {},
]
```

**Вывод**
123 456 789,01 $
$123,456,789.01
123.456.789,01 $
$12,34,56,789.01
١٢٣٬٤٥٦٬٧٨٩٫٠١ US$

### Примечания

Для проверки будет использоваться node.js 18 версии. На более старых версиях ответы могут отличаться:
```js
// Timestamp date  
module.exports = [  
    [["@date", 1676561884561]],  
    {},  
    {},  
]  
 
// node@19.2.0  
// четверг, 16 февраля 2023 г. в 18:38:04 GMT+3  
 
// node@14.17.5  
// четверг, 16 февраля 2023 г., 18:38:04 GMT+3  
//
```
### Решение

```js
const stringTokens = [
// ["#price"], " ", 
    // ["@plural", "#day", "tripDays"],
    // " - ",
    // ["@number", "$tripPrice", "USD"], 
    ["@date", 1676561884561],
    // ["@list", "Motocycle", "$item", "#bus"],
    // ["@relativeTime", -5, "hours"]
    // "key", " ", "$var", " ", "#translation"
    // '@date', 'Sun, 19 Feb 2023 09:57:14 GMT'
  ];
  
  const variables = {
    // tripDays: 10,
    // tripPrice: 56789.01,
    // item: "Car",
    // var: 100 

  };
  
  const translations = {
    // "ru-RU": {
    //   price: "Цена",
    //   day: {
    //     zero: "дней",
    //     one: "день",
    //     few: "дня",
    //     many: "дней",
    //     other: "дней"
    //   },
    //   bus: "Автобус", 
    // },
    
      // "ru-RU": { translation: "тест" },
      // "en-US": { translation: "test" },
      // "de-DE": { translation: "prüfen" },
      // "hi-IN": { translation: "परीक्षा" },
      // "ar-AA": { translation: "امتحان" },
  
  };


  
  const locale = "ar-AA";

  function getI18nText({ stringTokens, variables, translations, locale }) {
  
    const values = stringTokens.map((token) => {
      if (typeof token === 'string') {
        return (token[0] == "$" ) ? (Number(variables[token.substring(1)])) :
                (token[0] == "#" ) ? (translations[locale][token.substring(1)]) :
                (token);
      }
  
      const [type, ...args] = token;
  
      switch (type) {
        case '@date': {
          const options = {
            weekday: 'long', 
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZoneName: 'short',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };
          const [value] = args;
          const date = new Date(value); 
          return new Intl.DateTimeFormat(locale, options).format(date);
        }
  
        case '@number': {
          const [value, currency] = args;

          let num = Number(variables[value.substring(1)]);
          const options = currency
            ? {style: 'currency', currency}
            : {};
          return new Intl.NumberFormat(locale, options).format(num);
        }
  
        case '@plural': {
          const [key, number] = args;

          let type = key.substring(1);
          
          const plurForm = new Intl.PluralRules(locale).select(number);
          return variables[number] + " " + translations[locale][type][plurForm];
        }
  
        case '@list': {
          let items = args.map((item) => variables[item] || item);
          const newItems = [];
          for(let i = 0; i < items.length; i++){
            if(items[i][0] == "$"){
              newItems.push(variables[items[i].substring(1)]);
            }
            else if(items[i][0] == "#"){
              newItems.push(translations[locale][items[i].substring(1)]);
            }
            else{
              newItems.push(items[i])
            }
          };
          return new Intl.ListFormat(locale).format(newItems);
        }
  
        case '@relativeTime': {
          const [value, unit] = args;
          const options = { numeric: 'auto', style: 'short' };
          return new Intl.RelativeTimeFormat(locale, options).format(value, unit);
        }
  
        default: {
          return '';
        }
      }
    });
  
    return values.join(' ');
  }
  
  
  const result = getI18nText({ stringTokens, variables,     translations, locale });
  console.log(result); 
```
