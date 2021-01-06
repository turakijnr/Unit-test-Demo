const lib = require('./lib');
const db = require('./db')
const mail = require('./mail')
const { it, expect } = require("@jest/globals");


describe('absolute', () =>{
    it(' should return a positive number if input is positive', () =>{
  
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });
     
    it(' should return a positive number if input is negative', () =>{
       
         const result = lib.absolute(-1);
         expect(result).toBe(1);
    });
     
    it(' should return 0 if input is 0', () =>{
       
         const result = lib.absolute(0);
         expect(result).toBe(0);
    });
});

describe('greet', () =>{
    it('should return the greeting message', () => {
        const result = lib.greet('Mosh');
        expect(result).toBe('Welcome Mosh');
    });
})

describe('getCurrencies', () =>{
    it('should return supported currencies', () => {
        const result = lib.getCurrencies();
       
        // proper way
        // expect(result).toContain('USD');
        // expect(result).toContain('AUD');
        // expect(result).toContain('EUR');

        // ideal way
        expect(result).toEqual(expect.arrayContaining(['EUR','USD','AUD']))
    });
});
describe('getProduct', () =>{
    it('should return the product with the given id', () => {
       const result = lib.getProduct(1);
    //  expect(result).toEqual({ id: 1, price:10 });
       expect(result).toMatchObject({ id: 1, price:10 });
    });

});
describe('registerUser', () => {
    it('should throw if username is falsy', () => {
       
       const args = [null, undefined, NaN, '', 0, false];
       args.forEach(a => {
        expect(() => { lib.registerUser(a) }).toThrow();
       });
        
    });
    it('should return a user object if valid username is passed', () => {
        const result = lib.registerUser('decal');
        expect(result).toMatchObject({username: 'decal'});
        expect(result.id).toBeGreaterThan(0);
    });
});

describe('applyDiscount', () =>{
    it('should apply 10% discount if customer has more than 10 points',() =>{
        db.getCustomerSync = function(customerId) { //mock or fake function
            console.log('Fake reading customer...');
            return {id: customerId, points:20 };
        }
        
        const order = {customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);

    });
});

describe('notifyCustomer', ()=> {
    it('should send an email to the customer', ()=>{

       db.getCustomerSync = jest.fn().mockReturnValue({ email: 'a'});
       mail.send = jest.fn();

        lib.notifyCustomer({customerId: 1});

        expect(mail.send).toHaveBeenCalled();
        expect(mail.send.mock.calls[0][0]).toBe('a');
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });
});