const Accordion = () => {
  return (
    <section id="about" className="bg-violet py-10 md:py-16 text-neutral-content">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-4 text-center">FAQ</h2>
        <div className="collapse collapse-arrow">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">
            Which causes moved you to create this game?
          </div>
          <div className="collapse-content">
            <p className="mb-2">Picture a Piggy Bank, its belly filled with coins. 🐷 The pig symbolizes thrift, savings, and financial security.</p>
            <p className="mb-2">In our collection, the pig and money are forever linked. When an NFT is burned, its value contributes to social causes. The pig becomes a conduit for positive change, even as it grapples with its own corruption.</p>
            <p>So, next time you encounter a &quot;Corrupted Pig&quot;, remember that beneath the digital surface lies a narrative — a cautionary tale echoing both in pixels and ink.</p>
          </div>
        </div>

        <div className="collapse collapse-arrow">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">
            Why did you choose to create a collection around pigs?
          </div>
          <div className="collapse-content">
            <p className="mb-2">Pigs are often associated with filth and messiness. In the real world, corrupt individuals engage in shady dealings, hidden from public view.</p>
            <p>These &quot;Corrupted Pigs&quot; play a double game: they&apos;re both the perpetrators of obscure transactions and the victims of their own greed. Their digital snouts are stained with the dirt of deception.</p>
          </div>
        </div>

        <div className="collapse collapse-arrow">
          <input type="radio" name="my-accordion-2" />
          <div className="collapse-title text-xl font-medium">
            Which tale inspired this NFT collection?
          </div>
          <div className="collapse-content">
            <p className="mb-2">In &quot;Animal Farm&quot; by George Orwell, the allegorical tale portrays a group of farm animals who overthrow their human farmer in pursuit of a society where all animals are equal.</p>

            <p>However, their utopian vision is corrupted over time as power dynamics shift and a new ruling class of pigs emerges, led by Napoleon and Snowball. The pigs exploit their fellow animals for personal gain, betraying the principles of equality and fairness upon which the revolution was founded.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Accordion;
