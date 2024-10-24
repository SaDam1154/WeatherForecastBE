import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const app = express();

/*
    Here we are configuring our SMTP Server details.
    SMTP is a mail server which is responsible for sending and receiving emails.
*/
const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'sadam01664@gmail.com',
        pass: 'atam bptx gohc wlvq',
    },
});

let rand: number, mailOptions: nodemailer.SendMailOptions, host: string, link: string;

/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

app.get('/', (req: Request, res: Response) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/send', (req: Request, res: Response) => {
    rand = Math.floor(Math.random() * 100 + 54);
    host = req.get('host') as string;
    link = `http://${req.get('host')}/verify?id=${rand}`;

    mailOptions = {
        to: req.query.to as string,
        subject: 'Please confirm your Email account',
        html: `Hello,<br> Please Click on the link to verify your email.<br><a href="${link}">Click here to verify</a>`,
    };

    console.log(mailOptions);

    smtpTransport.sendMail(mailOptions, (error, response) => {
        if (error) {
            console.log(error);
            res.end('error');
        } else {
            console.log('Message sent: ' + response.response);
            res.end('sent');
        }
    });
});

app.get('/verify', (req: Request, res: Response) => {
    console.log(`${req.protocol}://${req.get('host')}`);
    if (`${req.protocol}://${req.get('host')}` === `http://${host}`) {
        console.log('Domain is matched. Information is from authentic email');
        if (req.query.id == rand.toString()) {
            console.log('Email is verified');
            res.end(`<h1>Email ${mailOptions.to} has been successfully verified</h1>`);
        } else {
            console.log('Email is not verified');
            res.end('<h1>Bad Request</h1>');
        }
    } else {
        res.end('<h1>Request is from an unknown source</h1>');
    }
});

/*--------------------Routing Over----------------------------*/

app.listen(3000, () => {
    console.log('Express started on Port 3000');
});
