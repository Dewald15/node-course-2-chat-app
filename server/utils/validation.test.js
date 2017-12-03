const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    var nonStr = isRealString(undefined);
    var spacedStr = isRealString('  string  ');
    var nonSpacedStr = isRealString('a');

    it('should reject non-string values', () => {
        expect(nonStr).toBe(false);
    });

    it('should accept spaced string values', () => {
        expect(spacedStr).toBe(true);
    });

    it('should allow strings with non-space characters', () => {
        expect(nonSpacedStr).toBe(true);
    });
});