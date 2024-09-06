const mongoose = require('mongoose');

async function  main() {
    try {
        await mongoose.connect(
            "mongodb+srv://davimdolabella:Ivad2008!@dbpartytime.3dhzw.mongodb.net/?retryWrites=true&w=majority&appName=dbpartytime"
        )
        
        console.log('conectado ao banco');
        
    } catch (error){
        console.log(`Erro: ${error}`);
        
    }
}

module.exports = main