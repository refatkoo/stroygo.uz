let orderSeq = 1;
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cors());

// 👉 Раздаём файлы из папки public
app.use(express.static('public'));

const TOKEN = process.env.TOKEN;
const CHAT_ID = process.env.CHAT_ID;


// Тест — главная страница
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Приём заказа
app.post('/order', async (req, res) => {
  const id = orderSeq++;
  const order = req.body;

  const message = `🧾 Заказ #${id}
Имя: ${order.clientName}
Телефон: ${order.clientPhone}
Адрес: ${order.clientAddress}
Товар: ${order.product}
Количество: ${order.quantity}
Оплата: ${order.paymentMethod}
Дата: ${order.date}`;

  try {
    await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      params: { chat_id: CHAT_ID, text: message }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
});


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
