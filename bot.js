const { Configuration, OpenAIApi } = require("openai");
const { Telegraf } = require('telegraf');

const key = OPEN_AI_TOKEN
const configuration = new Configuration({
    apiKey: key
});

const openai = new OpenAIApi(configuration);

async function generate(req, res) {

    try {
        console.log('prompt en generate ' + req);
        const response = await openai.createImage({
            prompt: req,
            n: 1,
            size: '512x512'
        });

        const imageUrl = response.data.data[0].url;
        return imageUrl;

    } catch (error) {
        console.log(error);
    }
}


const bot = new Telegraf(TELEGRAM_API_TOKEN);

bot.start((context) => {
    context.reply('Welcome ' + context.from.first_name + ' ' + context.from.last_name + ' to AI image generate bot' + '\u{1F600}'+'\n' +'You can type /help for more information.');
});

bot.help((context) => {
    context.reply('\u{1F352}' + 'How to use the bot?' + '\u{1F352}' + '\n' + '\n' + '\u{1F449}' + ' You must write "generate:" followed by the description of your image!')
});

bot.on('text', context => {
    const text = context.update.message.text;
    if (text.includes('generate:') || text.includes('Generate:') || text.includes('GENERATE:')) {
        let data = text.split(':');
        console.log('longitud ' + data.length)
        if (data.length < 2 || data.length > 2) {
            context.reply('It seems that you have entered the command wrong.' + '\n' + 'For more information type /help.')
        } else {
            let data_ = data[1];
            console.log('description: ', data_);
            if (data_ == '' || data_ == null) {
                context.reply('Your description must not be empty');
            } else {
                context.reply('Generating image ' + '\u{1F55D}');
                generate(data_).then((res) => {
                    console.log('obteniendo la url: ', res);
                    context.replyWithPhoto({ url: res }, { caption: 'Here is your image: ' + data_ })
                }).catch((error) => {
                    console.log('errror: ' + error)
                })
            }

        }


    }
})



bot.launch();