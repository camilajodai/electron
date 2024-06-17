

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
const aboutWindow = () => {
  // nativeTheme.themeSource = 'dark'
  const about = new BrowserWindow({
    width: 360, //largura
    height: 220,  //altura
    resizable: false, //evitar o redimensionamento
    // titleBarStyle: 'hidden', //esconder barra de título e menu
    autoHideMenuBar: true, //esconder menu
    icon: './src/public/img/icon.png' //ícone
  })

  about.loadFile('./src/views/sobre.html')
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
})
// exemplo 3: recebimento de um renderer de uma ação a ser executada
ipcMain.on('open-about', () => {
  aboutWindow()
})
