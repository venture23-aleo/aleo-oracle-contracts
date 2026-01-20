
import call1.aleo;
import call2.aleo;
program interface.aleo {



    // upgrade through the checksum mapping in another program
    @noupgrade
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }




async transition initialize(public owner_address: address) -> Future {
    let f1: Future = call1.aleo/initialize(owner_address);
    let f2: Future = call2.aleo/initialize(owner_address);
    return finalize_initialize(f1,f2);
  }

  // finalize initialization
  async function finalize_initialize(f1: Future, f2: Future) {
    // Wait for both futures to complete
    f1.await();
    f2.await();
  }



}