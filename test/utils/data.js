"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    url: 'http://localhost:3001',
    urlApi: 'http://localhost:3001/api/1',
    userCredentials: {
        invalidEmail: {
            Email: "invalid@ere.com",
            Password: "aergaergaer"
        },
        invalidPassword: {
            Email: "dmitrevski2@gmail.com",
            Password: "aergaergaer"
        },
        valid: {
            Email: "dmitrevski2@gmail.com",
            Password: "12345"
        }
    },
    cargo: {
        idForUpdate: '58089115c035d4ee58f2352d',
        idForDelete: '58089115c035d4ee58f2352d',
        updateCargo: {
            Dimensions: {
                Weight: 50,
                Volume: 2,
            },
            Description: "I'm the newest version of this object",
            TypeOfCargo: 1
        },
        createCargo: {
            Dimensions: {
                Weight: 150,
                Volume: 100,
                Width: 50,
                Height: 1,
                Length: 5
            },
            CreatedBy: "57fbbabd960718ad4eaf6d0b",
            Description: "Inserted Cargo",
            TypeOfCargo: 2,
            Client: "57fbbabd960718ad4eaf6d0b"
        }
    }
};
//# sourceMappingURL=data.js.map