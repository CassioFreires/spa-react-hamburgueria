import React, { useState, useEffect } from 'react';

const Home = () => {
  // Dados mockados simulando a resposta de uma API
  const [menuItems, setMenuItems] = useState([]);
  const [sobreInfo, setSobreInfo] = useState('');

  // Simulação de requisição de dados de uma API
  useEffect(() => {
    // Simulação de delay para carregar os dados (como se fosse uma requisição à API)
    setTimeout(() => {
      const mockMenuData = [
        {
          id: 1,
          nome: 'Hamburguer Tradicional',
          descricao: 'Deliciosamente suculento, feito com carne 100% angus.',
          preco: 'R$ 28,00',
          imagem: 'https://www.shutterstock.com/shutterstock/photos/2317841245/display_1500/stock-photo-burger-artisan-burger-hamburguer-homemade-burger-hamburguer-artesanal-cheese-bacon-and-fries-queijo-2317841245.jpg',
        },
        {
          id: 2,
          nome: 'Hamburguer Gourmet',
          descricao: 'Uma combinação única de sabores premium.',
          preco: 'R$ 38,00',
          imagem: 'https://www.shutterstock.com/shutterstock/photos/2317841245/display_1500/stock-photo-burger-artisan-burger-hamburguer-homemade-burger-hamburguer-artesanal-cheese-bacon-and-fries-queijo-2317841245.jpg',
        },
        {
          id: 3,
          nome: 'Hamburguer Vegetariano',
          descricao: 'Feito com ingredientes frescos e saborosos, ideal para quem busca uma opção saudável.',
          preco: 'R$ 32,00',
          imagem: 'https://www.shutterstock.com/shutterstock/photos/2317841245/display_1500/stock-photo-burger-artisan-burger-hamburguer-homemade-burger-hamburguer-artesanal-cheese-bacon-and-fries-queijo-2317841245.jpg',
        },
      ];

      const mockSobreData = 'A *Brothers Traditions* nasceu da paixão por criar hambúrgueres com ingredientes de alta qualidade e sabores autênticos. Cada hambúrguer é feito com amor e dedicação, para proporcionar uma experiência única aos nossos clientes. Somos uma hamburgueria que valoriza a tradição e qualidade em cada detalhe.';

      setMenuItems(mockMenuData);
      setSobreInfo(mockSobreData);
    }, 1000); // Simula 1 segundo de delay
  }, []);

  return (
    <div className="font-sans bg-slate-600">

      {/* Hero Section */}
      <section className="relative bg-cover bg-center h-screen" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1566758437-b9270f0c5155?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg0MXwwfDF8c2VhY2h8OXx8aGFtYnVyZ3xlbnwwfHx8fDE2Nzg1Mzg1Mzg&ixlib=rb-1.2.1&q=80&w=1080)' }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="flex items-center justify-center text-center h-full text-white px-4">
          <div>
            <h2 className="text-5xl font-extrabold leading-tight mb-4">A Tradição de Sabores</h2>
            <p className="text-xl mb-6">Descubra os sabores autênticos dos nossos hambúrgueres feitos com paixão e qualidade.</p>
            <a href="#menu" className="bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-yellow-700 transition">Veja o Menu</a>
          </div>
        </div>
      </section>

      {/* Seção de Menu */}
      <section id="menu" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-gray-800 mb-12">Nosso Menu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <div key={item.id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden">
                  <img src={item.imagem} alt={item.nome} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{item.nome}</h3>
                    <p className="text-gray-600 mb-4">{item.descricao}</p>
                    <p className="text-xl font-bold text-yellow-600">{item.preco}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xl text-gray-600">Carregando menu...</p>
            )}
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className="py-16 bg-yellow-600 text-white">
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-4xl font-semibold mb-8">Sobre a Brothers Traditions</h2>
          <p className="text-xl mb-6">{sobreInfo}</p>
          <p className="text-lg">Venha nos visitar e descubra o sabor que vai conquistar seu paladar!</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
