

program call2.aleo {

    mapping admin: bool => address;

    // upgrade through the checksum mapping in another program
    @noupgrade
    async constructor() {
        // The Leo compiler automatically generates the constructor logic.
    }




async transition initialize(public owner_address: address) -> Future {

    return finalize_initialize(owner_address);
  }

  // finalize initialization
  async function finalize_initialize(public owner_address: address) {


    Mapping::set(admin, true, owner_address);
  }



}