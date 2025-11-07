program veru_oracle_checksum_v2.aleo {

    mapping approved_checksums: address => [u8; 32];
    mapping admin: bool => address;

    const INITIALIZER_ADDRESS: address = aleo1fg8y0ax9g0yhahrknngzwxkpcf7ejy3mm6cent4mmtwew5ueps8s6jzl27;

    async transition initialize(admin_address: address) -> Future {
        assert_eq(self.caller, INITIALIZER_ADDRESS);
        return (finalize_initialize(admin_address));
    }
    async function finalize_initialize(admin_address: address) {
        assert(admin.contains(true).not());
        admin.set(true, admin_address);
    }

    async transition set_admin(admin_address: address) -> Future {
        return (finalize_set_admin(self.caller, admin_address));
    }
    async function finalize_set_admin(from: address, admin_address: address) {
        let owner: address = admin.get(true);
        assert_eq(from, owner);
        admin.set(true, admin_address);
    }
    
    async transition update_program_checksum(program_address: address, approved_checksum: [u8; 32]) -> Future {
        return (finalize_update_pc(self.caller, program_address, approved_checksum));
    }
    async function finalize_update_pc(from: address, program_address: address, approved_checksum: [u8; 32]) {
        let owner: address = admin.get(true);
        assert_eq(from, owner);
        approved_checksums.set(program_address, approved_checksum);
    }

    @noupgrade
    async constructor() {}
}