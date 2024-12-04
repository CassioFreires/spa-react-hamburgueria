const Footer = () => {
    return (
      <footer className="bg-gray-800 text-white py-8 px-4 md:px-12">
        {/* Seção de Contato Social */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <div>
            <p className="text-2xl font-semibold mb-4">Rede <span className="text-blue-400">Social</span></p>
            <div>
              <p className="text-sm mb-2">Instagram: <a href="#" className="text-blue-400 hover:underline">Link</a></p>
              <p className="text-sm mb-2">Email: <a href="#" className="text-blue-400 hover:underline">Link</a></p>
              <p className="text-sm mb-2">Telefone: <a href="#" className="text-blue-400 hover:underline">Link</a></p>
              <p className="text-sm mb-2">Endereço: <a href="#" className="text-blue-400 hover:underline">Link</a></p>
            </div>
          </div>
  
          {/* Formulário de Suporte */}
          <div>
            <fieldset className="mb-4">
              <legend className="text-lg font-semibold">Suporte</legend>
              <form>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail</label>
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="Digite seu e-mail" 
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Mensagem</label>
                  <textarea 
                    id="message" 
                    placeholder="Digite sua mensagem" 
                    className="w-full p-2 rounded-lg border border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    rows="4"
                  />
                </div>
                <div>
                  <button 
                    type="submit" 
                    className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </fieldset>
          </div>
  
          {/* Direitos Reservados */}
          <div className="flex justify-center md:justify-end items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} Todos os direitos reservados</p>
          </div>
        </div>
  
        {/* Linha de separação */}
        <div className="border-t border-gray-700 pt-4">
          <p className="text-center text-sm text-gray-400">
            Feito com ♥ pela equipe.
          </p>
        </div>
      </footer>
    );
  }
  
export default Footer;