/**
 * Processo de renderização do documento index.html
 */

console.log("Processo de renderização")
// recebe vinculado ao preload.js
console.log(`Electron: ${api.verElectron()}`)

// envio de uma mensagem
api.hello("oi")

// recebimento de uma mensagem
api.answer((event, message) => [
    console.log(`processo de renderização recebeu uma mensagem: ${message}`)
])

// função que é executada quando o botão for clicado 
function sobre() {
    api.openAbout()
}

// dialogs (caixa de msg)
function info() {
    api.info()
}


function warning() {
    api.warning()
}


function select() {
    api.select()
}