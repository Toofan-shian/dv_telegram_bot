const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;

// Check if token exists
if (!token) {
  console.error('❌ Error: TELEGRAM_TOKEN is not defined in .env file');
  console.error('Please create a .env file with your bot token:');
  console.error('TELEGRAM_TOKEN=your_bot_token_here');
  process.exit(1);
}

// Replace with your actual registration & support links
const REGISTRATION_URL = 'https://sabtedv.com/lottery-register-form';
const SUPPORT_TELEGRAM_ID = '@toofan_shafian';

const bot = new TelegramBot(token, { 
  polling: {
    interval: 300,
    autoStart: true,
    params: {
      timeout: 10
    }
  }
});

// Handle bot errors
bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message);
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error.message);
  console.error('This might be due to:');
  console.error('1. Invalid bot token');
  console.error('2. Network connectivity issues');
  console.error('3. Telegram API server problems');
});

// Add connection success message
bot.on('message', () => {
  // This will only fire when bot successfully receives messages
  console.log('✅ Bot is connected and receiving messages');
});

// Log bot startup
console.log('🤖 SabteDV Telegram Bot starting...');
console.log('📱 Bot is ready and waiting for messages!');

// Inline keyboard reused for editing
const inlineKeyboard = [
  [{ text: "✅ ثبت نام در سایت", url: REGISTRATION_URL }],
  [
    { text: "🤔 چگونه اعتماد کنم", callback_data: 'trust' },
    { text: "📞 پشتیبانی", callback_data: 'support' }
  ],
  [
    { text: "📝 درباره لاتاری", callback_data: 'about' },
    { text: "📜 شرایط ثبت نام لاتاری", callback_data: 'terms' }
  ]
];

// Store file IDs for images to avoid re-uploading
const imageFileIds = {
  welcome: null,
  trust: null,
  support: null,
  about: null,
  terms: null
};

// Helper function to send image efficiently
async function sendImageEfficiently(chatId, imageType, caption, replyMarkup) {
  const imagePath = `./images/${imageType}.jpg`;
  
  try {
    // Try to use stored file_id first
    if (imageFileIds[imageType]) {
      console.log(`⚡ Using cached file_id for ${imageType}: ${imageFileIds[imageType]}`);
      return await bot.sendPhoto(chatId, imageFileIds[imageType], {
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: replyMarkup
      });
    }
    
    // If no file_id, upload and store it
    const sentMessage = await bot.sendPhoto(chatId, imagePath, {
      caption: caption,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
      contentType: 'image/jpeg'
    });
    
    // Store file_id for future use
    if (sentMessage.photo && sentMessage.photo.length > 0) {
      imageFileIds[imageType] = sentMessage.photo[sentMessage.photo.length - 1].file_id;
      console.log(`📸 Image file_id stored for ${imageType}: ${imageFileIds[imageType]}`);
    }
    
    return sentMessage;
  } catch (err) {
    console.error(`Error sending ${imageType} image:`, err.message);
    throw err;
  }
}

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Log the start command
  console.log(`🚀 Bot started by user ${msg.from.username || msg.from.first_name} (ID: ${msg.from.id})`);

  const title = "🌍 <b>به <code>sabtedv.com</code> سایت تخصصی ثبت‌نام لاتاری آمریکا خوش آمدید</b>";
  const description = `اینجا می‌تونید با <b>ساده‌ترین و مطمئن‌ترین روش</b>، شانس خودتون برای دریافت گرین‌کارت آمریکا رو امتحان کنید. ما همه مراحل رو برای شما ساده کردیم تا بدون نگرانی و با اطمینان کامل ثبت‌نام کنید.

✅ سایت ما دارای <b>نماد اعتماد الکترونیک</b> با سابقه درخشان و بدون هیچ نارضایتی است، پس می‌تونید با خیال راحت اقدام کنید.

⏳ <i>فرصت رو از دست ندید</i> و برای تکمیل فرم ثبت‌نام، همین حالا از طریق لینک زیر اقدام کنید:

👉 <a href="${REGISTRATION_URL}"><b>ثبت نام در سایت</b></a>`;

  try {
    await sendImageEfficiently(chatId, 'welcome', `${title}\n\n${description}`, { inline_keyboard: inlineKeyboard });
  } catch (err) {
    console.error(err);
  }
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const messageId = query.message.message_id;
  const data = query.data;

  // Log the button press
  console.log(`🔘 Button pressed: "${data}" by user ${query.from.username || query.from.first_name} (ID: ${query.from.id})`);

  let newText = '';

  if (data === 'trust') {
    newText = `
<b>🛡️ چرا می‌توانید به ما اعتماد کنید؟</b>

در فضای آنلاین، پیش از استفاده از هر خدمتی باید از قابل اعتماد بودن وب‌سایت اطمینان پیدا کرد.
یکی از معتبرترین راه‌ها برای این اطمینان، بررسی نماد اعتماد الکترونیکی (eNAMAD) است.
نماد اعتماد تنها توسط وزارت صنعت، معدن و تجارت به وب‌سایت‌هایی داده می‌شود که تمامی مراحل بررسی و احراز هویت را با موفقیت گذرانده باشند.
داشتن این نماد یعنی:
✅ هویت واقعی و قانونی وب‌سایت تأیید شده است.
✅ امنیت تراکنش‌ها و خدمات آنلاین تضمین شده است.
✅ در صورت نارضایتی مشتری، امکان ثبت شکایت رسمی وجود دارد.

اما نکته مهم اینجاست:
📌 شما می‌توانید با جستجوی نام <code>sabtedv.com</code> در سامانه eNAMAD، خودتان ببینید که ما هیچ شکایت یا نارضایتی ثبت‌شده‌ای نداریم. این یعنی کاربران قبلی با رضایت کامل خدمات ما را دریافت کرده‌اند.

⏳ پس این فرصت طلایی را از دست ندهید و با خیالی آسوده همین حالا ثبت‌نام خود را آغاز کنید:

👉 <a href="${REGISTRATION_URL}"><b>ثبت نام در سایت</b></a>
    `;
  }
  if (data === 'support') {
    newText = `<b>از ثبت نام تا نتیجه، همراه شماییم 🤝</b>

<i>سوال یا ابهامی دارید؟</i> تیم پشتیبانی ما هر روز از ساعت <b>8 صبح الی 10 شب</b> آماده پاسخ گویی به تمام پرسش های شماست - چه درباره شرایط ثبت نام، بارگذاری مدارک یا تکمیل فرم. در تمام مسیر کنارتون هستیم تا ثبت نامی ساده و بی دغدغه داشته باشید.

<b> برای ارتباط مستقیم با پشتیبانی کافیه در تلگرام پیام بدید:</b>
👉 <a href="https://t.me/${SUPPORT_TELEGRAM_ID.replace('@', '')}">${SUPPORT_TELEGRAM_ID}</a>`;
  }
  if (data === 'about') {
    newText = `<b>🚀 سریع ترین و ساده ترین راه دریافت اقامت آمریکا</b>

<b>📅 تاریخچه لاتاری:</b>
در سال ۱۹۹۰، دولت آمریکا، به‌منظور ایجاد تنوع در جامعه مهاجران آمریکا، برنامه ویزای لاتاری را تصویب کرد و از آن زمان تاکنون، تعداد زیادی از هموطنان ما <i>(حدوداً 55,000 نفر در سال)</i>، با این روش به ایالات متحده مهاجرت کرده‌اند.

<i>این روزها که روند مهاجرت به هر نقطه از دنیا، با چالش‌ها و شرایط سختی روبه‌روست، لاتاری می‌تواند شانس خوبی برای شما باشد و بهتر است آن را از دست ندهید.</i>

<b>⚠️ چرا باید دقت کنید؟</b>
روند ثبت نام لاتاری آمریکا باید با دقت بالایی انجام شود و بسیاری از افراد به‌خاطر یک اشتباه کوچک،‌ یا عدم توجه به نکات جزیی، یا ثبت نام آنها ریجکت شده یا حتی بعد از برنده شدن لاتاری، در روند کار به مشکل برخورده‌اند.
به‌همین دلیل توصیه می‌کنیم که پروسه ثبت نام خود را به ما بسپارید تا در کوتاه‌ترین زمان ممکن، و با تضمین سلامت، روند کار ثبت نام شما انجام شود.

 👉 <a href="${REGISTRATION_URL}"><b>ثبت نام در سایت</b></a>`;
  }
  if (data === 'terms') {
    newText = `🌟 <b>شرایط ساده برای ورود به دنیای فرصت‌ها</b>

برای شرکت در لاتاری گرین‌کارت آمریکا 1404، نیازی به شرایط پیچیده و دشوار نیست:

✅ فقط کافی‌ست ساکن کشورهای مجاز لاتاری مثل ایران باشید.
✅ حداقل مدرک دیپلم داشته باشید، یا اگر مدرک ندارید، باید دو سال سابقه کار داشته باشید. (ارائه مدرک یا سابقه کار در مرحله ثبت‌نام نیاز نیست و فقط پس از برنده شدن مورد نیاز خواهد بود.)
✅ برای ثبت‌نام، حتی نیازی به پاسپورت هم ندارید؛ اما در صورت برنده شدن، برای دریافت ویزا باید پاسپورت تهیه کنید.

⏳ این فرصت طلایی هر سال فقط یک بار اتفاق می‌افتد. شانس خود را از دست ندهید! همین حالا ثبت‌نام کنید و یک قدم بزرگ به سوی آینده‌ای متفاوت بردارید.

👉 <a href="${REGISTRATION_URL}"><b>ثبت نام در سایت</b></a>`;
  }

  // Always acknowledge the callback query first
  try {
    await bot.answerCallbackQuery(query.id);
  } catch (ackErr) {
    console.log('Could not acknowledge callback query (may be too old):', ackErr.message);
    // Continue anyway - this is not critical
  }

  // Since we're changing the image, we need to send a new message instead of editing
  try {
    // Try to delete the old message first
    await bot.deleteMessage(chatId, messageId);
  } catch (deleteErr) {
    console.log('Could not delete old message, continuing...');
  }
  
  // Send a new message with the new image efficiently
  try {
    await sendImageEfficiently(chatId, data, newText, { inline_keyboard: inlineKeyboard });
  } catch (sendErr) {
    console.error('Error sending new message with image:', sendErr.message);
    // Fallback: send text message if image fails
    try {
      await bot.sendMessage(chatId, newText, {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: inlineKeyboard }
      });
    } catch (textErr) {
      console.error('Error sending text message:', textErr.message);
      // Final fallback: send without any formatting
      try {
        await bot.sendMessage(chatId, newText, {
          reply_markup: { inline_keyboard: inlineKeyboard }
        });
      } catch (finalErr) {
        console.error('Error sending final fallback message:', finalErr.message);
      }
    }
  }
});
