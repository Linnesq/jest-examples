const HttpBinClient = require('./httpbin-client');
const UrlValidator = require('./url-validator');

const nodeFetch = require('node-fetch');

jest.mock('node-fetch');
jest.mock('./url-validator');

describe('httpbin-client: simple class with dependecies', () => {
    beforeEach(() => {
        // necessary, to reset toHaveBeenCalledTimes count for fetch
        jest.resetAllMocks();
    });

    it('returns json from api', async () => {
        const testClass = new HttpBinClient('example.com');

        nodeFetch.mockResolvedValue({
            ok: true,
            json: () => ({url: 'example.com'}),
        });
        
        const expectedResponse = {url: 'example.com'}
        
        // this ...
        const actual = await testClass.simpleGet();
        expect(actual).toEqual(expectedResponse)
        
        // ... and this are equivalent
        await expect(testClass.simpleGet()).resolves.toEqual(expectedResponse);

        expect(nodeFetch).toHaveBeenCalledTimes(2);
        expect(nodeFetch).toHaveBeenCalledWith('example.com/get')
    });
    
    it('has a base url member', () => {
        const testClass = new HttpBinClient('example.com');

        expect(testClass.baseUrl).toEqual('example.com');
        expect(nodeFetch).toHaveBeenCalledTimes(0);
    });
    
    it('throws an error when the response is bad', async () => {
        const testClass = new HttpBinClient('example.com');
        const jsonFn = jest.fn();

        nodeFetch.mockResolvedValue({
            ok: false,
            json: jsonFn,
        });

        await expect(testClass.simpleGet()).rejects.toThrow('Request Failed');
        expect(jsonFn).not.toHaveBeenCalled();
    });

    it('can get a uuid if the url being fetched is valid', async () => {
        // a slightly concocted scenario to test a class used by a class!
        // mocking the validator used in the client
        const mockUrlValidator = jest.fn();
        UrlValidator.prototype.validate = mockUrlValidator;
        mockUrlValidator.mockReturnValue(true);
        
        //mocking the client's call to fetch
        nodeFetch.mockResolvedValue({
            ok: true,
            json: () => ({uuid: 'iamauuid'}),
        });

        const testClass = new HttpBinClient('example.com');
        
        await expect(testClass.safeUuidGet()).resolves.toEqual({ uuid: 'iamauuid'});
        expect(mockUrlValidator).toHaveBeenCalledTimes(1);
    });
    
    it('cannot fetch a uuid if the url is invalid', async () => {
        const mockUrlValidator = jest.fn();
        
        UrlValidator.prototype.validate = mockUrlValidator;
        mockUrlValidator.mockReturnValue(false);
        const testClass = new HttpBinClient('example.com');
        
        await expect(testClass.safeUuidGet()).rejects.toThrow('Invalid URL');
    });
});