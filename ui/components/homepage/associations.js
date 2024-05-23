import Image from "next/image";
import Link from "next/link";

const Associations = () => {
  return (
    <section id="associations" className="bg-gray-200 py-10 px-2 lg:py-12 text-center">
      <h2 className="text-4xl font-bold text-purple mb-1">Associations</h2>
      <h3 className="text-xl font-bold text-purple mb-6">List of projects that need our support</h3>

      <div className="carousel carousel-end space-x-4 md:space-x-6 max-w-full rounded-box">
        <div className="carousel-item">
          <div className="card card-compact max-w-80 md:max-w-96 bg-base-100 shadow-xl dark:bg-gray-100 dark:text-black">
            <figure>
              <img src="https://enea.apambiente.pt/sites/default/files/styles/slick_800x600/public/images/enea/galerias/kit2_DA.jpg?itok=2I0_oqGD" width="300" alt="Projeto Rios" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-purple">Projeto Rios</h2>
              <p className="text-clip h-40 overflow-hidden">O Projeto Rios é um projeto ibérico coordenado, a nível nacional, pela Associação Portuguesa de Educação Ambiental (ASPEA) e que incentiva a adoção de troços de 500 metros de rios ou ribeiras por grupos locais organizados. Recorrendo a uma metodologia de observação simples, mas rigorosa, de fácil aplicação e desenvolvimento, os grupos assumem a responsabilidade de vigilância e proteção do troço escolhido, contribuindo assim para a melhoria ambiental dos recursos hídricos, em geral, e para promoção de ações de melhoria do troço, em particular.</p>
              <div className="card-actions justify-end">
                <Link
                  href="https://enea.apambiente.pt/content/projeto-rios"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >Read more</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="card card-compact max-w-80 md:max-w-96 bg-base-100 shadow-xl dark:bg-gray-100 dark:text-black">
            <figure>
              <Image src="/patav.jpeg" alt="PATAV" width={350} height={300}/>
            </figure>
            <div className="card-body">
              <h2 className="card-title text-purple">PATAV</h2>
              <p className="text-clip h-40 overflow-hidden">PATAV (Plataforma Anti Transporte de Animais Vivos) apresenta-se como um Movimento Cívico que tem como objeto defender a abolição do transporte de animais vivos por via marítima de Portugal para o Médio Oriente e Norte de África.</p>
              <div className="card-actions justify-end">
                <Link
                  href="https://patav.weebly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >Read more</Link>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item">
          <div className="card card-compact max-w-80 md:max-w-96 bg-base-100 shadow-xl dark:bg-gray-100 dark:text-black">
            <figure>
              <img src="https://www.baladi.pt/wp-content/uploads/2022/05/BALADI_Logotipo.png" width="300" alt="Federação Nacional dos Baldios" />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-purple">Federação Nacional dos Baldios</h2>
              <p className="text-clip h-40 overflow-hidden">A figura do Agrupamento de Baldios, que nunca foi utilizada, revela neste momento uma importância acrescida, uma vez que com a criação de condições específicas de aplicação será dado um passo importante para uma gestão sustentável, com todas as mais-valias que advêm do associativismo e de uma economia de escala.</p>
              <div className="card-actions justify-end">
                <Link
                  href="https://www.baladi.pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >Read more</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Associations;
