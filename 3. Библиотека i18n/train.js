//@date
const options = {
    weekday: 'long', 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
};

const date = new Date(1676561884561);
console.log(date);

const dateFormatter = new Intl.DateTimeFormat("ru-RU", options); //string
console.log(dateFormatter.format(date));

//@number
let number = 56789.01;
let currency = 'USD';

const numOptions = {
    style: 'currency', 
    currency: currency,
};

const numFormatter = new Intl.NumberFormat("ru-RU", numOptions);
console.log(numFormatter.format(number));


//@plural
const translations = {
    "ru-RU": {
      price: "Цена",
      day: {
        zero: "дней",
        one: "день",
        few: "дня",
        many: "дней",
        other: "дней"
      }
    }
  };

// const variables = {
//     tripDays: 10,
//     tripPrice: 56789.01,
// };
tripDays = 2;

const plurFormatter = new Intl.PluralRules("ru-RU").select(tripDays);
let message = tripDays + " " + translations["ru-RU"]["day"][plurFormatter];
console.log(message);




