require("./env");

var vows = require('vows');
var assert = require('assert');

var suite = vows.describe('Utils');

suite.addBatch({
    'dc.printer.filter':{
        topic:function(){
            return dc.printers.filter;
        },
        'print simple string':function(printer){
            assert.equal(dc.printers.filter("a"), "a");
        },
        'print date string':function(printer){
            assert.equal(dc.printers.filter(new Date(2012, 1, 1)), "02/01/2012");
        },
        'print int range':function(printer){
            assert.equal(dc.printers.filter([10, 30]), "[10 -> 30]");
        },
        'print float range':function(printer){
            assert.equal(dc.printers.filter([10.124244, 30.635623]), "[10 -> 31]");
        },
        'print date range':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1), new Date(2012, 1, 15)]), "[02/01/2012 -> 02/15/2012]");
        },
        'print single element array':function(printer){
            assert.equal(dc.printers.filter([new Date(2012, 1, 1)]), "02/01/2012");
        },
        'print null':function(printer){
            assert.equal(dc.printers.filter(null), "");
        }
    }
});

suite.addBatch({
    'dc.printer.CulmulativeReduceTarget':{
        topic:function(){
            return new dc.utils.CulmulativeReduceTarget();
        },
        'is a class':function(target){
            assert.isTrue(target instanceof dc.utils.CulmulativeReduceTarget);
        },
        'can store and retrieve value by key':function(target){
            var key = "key";
            var value = 100;
            target.addValue(key, value);
            target.addValue(key, value);
            assert.equal(target.getValueByKey(key), value * 2);
            assert.equal(target.size(), 1);
            target.clear();
        },
        'can retrieve cumulative value by key':function(target){
            var key = "key";
            var value = 100;
            target.addValue("0", 10);
            target.addValue("a", value);
            target.addValue(key, 19);
            target.addValue("4", 4);
            assert.equal(target.getCumulativeValueByKey(key), value + 10 + 19);
            assert.equal(target.getCumulativeValueByKey("4"), value + 10 + 19 + 4);
            target.clear();
        },
        'can retrieve value by out of range key':function(target){
            var key = "key";
            var value = 100;
            target.addValue("key", value);
            assert.equal(target.getCumulativeValueByKey("not found"), 0);
            target.clear();
        },
        'can reduce value by key':function(target){
            var key = "key";
            var value = 100;
            target.addValue(key, value);
            target.addValue(key, value);
            target.minusValue(key, value);
            assert.equal(target.getValueByKey(key), value);
            assert.equal(target.size(), 1);
            target.clear();
        },
        'can store and retrieve value by date key':function(target){
            var key = new Date(2012, 1, 1);
            var value = 100;
            target.addValue(key, value);
            target.addValue(key, value);
            target.addValue(key, value);
            target.minusValue(key, value);
            assert.equal(target.getValueByKey(key), value * 2);
            assert.equal(target.size(), 1);
            target.clear();
        },
    }
});

suite.export(module);


