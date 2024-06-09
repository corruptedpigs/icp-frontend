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
              <p className="text-clip h-40 overflow-hidden">The Projeto Rios is an Iberian initiative coordinated nationally by the Associação Portuguesa de Educação Ambiental (ASPEA). It encourages local groups to adopt 500-meter sections of rivers or streams. Using a simple yet rigorous observation method, these groups take responsibility for monitoring and protecting their chosen section, thereby improving water resources and promoting specific improvements to their section.</p>
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
              <Image src="/patav.png" alt="PATAV" width={350} height={300}/>
            </figure>
            <div className="card-body">
              <h2 className="card-title text-purple">PATAV</h2>
              <h3>(Plataforma Anti-Transporte de Animais Vivos)</h3>
              <p className="text-clip h-40 overflow-hidden">PATAV presents itself as a civic movement whose aim is to defend the abolition of the transport of livestock by sea from Portugal to the Middle East and North Africa.</p>
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
              <p className="text-clip h-40 overflow-hidden">BALADI - Federação Nacional dos Baldios, has been working with forestry organisations to establish protocols for management, awareness-raising, fire protection and forest protection.</p>
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
