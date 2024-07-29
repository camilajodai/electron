

const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron')

// está relacionado ao preload.js
const path = require('node:path')

// janela principal
const createWindow = () => {
  // nativeTheme.themeSource = 'dark'
  const win = new BrowserWindow({
    width: 800, //largura
    height: 600,  //altura
    // resizable: false, //evitar o redimensionamento
    // titleBarStyle: 'hidden', //esconder barra de título e menu
    // autoHideMenuBar: true, //esconder menu
    icon: './src/public/img/icon.png', //ícone
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // iniciar a janela com o menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  win.loadFile('./src/views/index.html')
}

//janela sobre
let about // resolver bug de abertuda de varias janelas

const aboutWindow = () => {
  // se a janela about não estiver aberta(bug 1)
  if (!about) {
    about = new BrowserWindow({
      width: 360, //largura
      height: 220,  //altura
      resizable: false, //evitar o redimensionamento
      autoHideMenuBar: true, //esconder menu
      icon: './src/public/img/icon.png' //ícone
    })
  }

  about.loadFile('./src/views/sobre.html')
  // reabrir a janela se estiver fechada
  about.on('closed', () => {
    about = null
  })

}

// janela secundária
const childWindow = () => {
  // a linha abaixo obtem a janela pai (principal)
  const father = BrowserWindow.getFocusedWindow()
  if (father) {
    const child = new BrowserWindow({
      width: 640,
      height: 450,
      icon: './src/public/img/icon.png',
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true
    })
    child.loadFile('./src/views/child.html')
  }
}

// executar de forma assíncrona a aplicação
app.whenReady().then(() => {
  createWindow()
})

// template do menu personalizado

const template = [
  {
    label: 'Arquivo',
    submenu: [
      {
        label: 'Janela secundária',
        click: () => childWindow()
      },
      {
        label: 'Sair',
        click: () => app.quit(),
        accelerator: 'Alt+F4'
      }
    ]
  },
  {
    label: 'Exibir',
    submenu: [
      {
        label: 'Recarregar',
        role: 'reload',
      },
      {
        label: 'Ferramentas do desenvolvedor',
        role: "toggleDevTools",
      },
      {
        type: 'separator'
      },
      {
        label: 'Aplicar zoom',
        role: 'zoomIn',
      },
      {
        label: 'Reduzir',
        role: 'zoomOut',
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom',
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Docs',
        accelerator: 'Alt+F1',
        click: () => shell.openExternal('https://www.electronjs.org/docs/latest/'),
      },
      {
        type: 'separator'
      },
      {
        label: 'Sobre',
        click: () => aboutWindow(),
      }
    ]
  }
]

// Processos
console.log("Processo principal")
// exemplo 1: comando que só funciona no JS
console.log(`Electron: ${process.versions.electron}`)
// exeplo 2: recebimento de uma mensagem do renderer
ipcMain.on('send-message', (event, message) => {
  console.log(`Processo principal recebeu uma mensagem: ${message}`)
  // enviar uma resposta ao renderizador
  event.reply('receive-message', "olá renderizador")
})


// exemplo 3: recebimento de um renderer de uma ação a ser executada
ipcMain.on('open-about', () => {
  aboutWindow()
})
