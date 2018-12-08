const {app, BrowserWindow} = require ('electron');
const fs = require('fs')
const handlebars = require('handlebars');

const header = './header.hbs';
const drawer = './drawer.hbs';
const search_bar = './search-bar.hbs';
const index_in = './index.hbs';
const index_out = './index.html';
const student_in = './student.hbs';
const student_out = './student.html';

const student = require('./student.json');

const partial_converter = (inFile) => {
    return handlebars.compile(fs.readFileSync(inFile, 'utf8'), {strict: true});
}

handlebars.registerPartial('header', partial_converter(header));
handlebars.registerPartial('drawer', partial_converter(drawer));
handlebars.registerPartial('search_bar', partial_converter(search_bar));

const hbs_converter = (inFile, outFile, data) => {
    const source = fs.readFileSync(inFile, 'utf8');
    const template = handlebars.compile(source, {strict: true});
    const result = template(data);
    
    fs.writeFileSync(outFile, result);
    console.log(`File written to ${outFile}`);
}

hbs_converter(index_in, index_out, student);
hbs_converter(student_in, student_out, student);



let win

const createWindow = () => {
    win = new BrowserWindow({
        width: 1200,
        height: 800
    })

    win.loadFile('index.html')

    // win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})