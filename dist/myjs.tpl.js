"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LiteTmplate = /** @class */ (function () {
    function LiteTmplate(tpl) {
        var lines = this.parseTpl(tpl);
        var code = this.genTplCode(lines);
        this.func = this.genFunction(code);
    }
    LiteTmplate.prototype.parseTpl = function (tpl) {
        var tplLines = []; //返回的数组，用于保存匹配结果
        var regExp = /<%([\s\S]*?)%>/g; //用于匹配js代码的正则 <%%>里面加入代码
        var match; //当前匹配到的match
        var index = 0; //当前匹配到的索引     
        //tpl = tpl.replace(/<%=([\s\S]*?)%>/g,"${$1}"); // <%= %> 模板格式
        tpl = tpl.replace(/{{([\s\S]*?)}}/g, "${$1}"); // {{}} 模板格式,此格式更易读,更适合嵌入html标签中
        while (match = regExp.exec(tpl)) {
            // 保存当前匹配项之前的普通文本/占位
            tplLines.push({ isCode: false, value: tpl.substring(index, match.index) });
            tplLines.push({ isCode: true, value: match[1] });
            //更新当前匹配索引
            index = match.index + match[0].length;
        }
        //保存文本尾部
        tplLines.push({ isCode: false, value: tpl.substr(index) });
        return tplLines;
    };
    LiteTmplate.prototype.genTplCode = function (frags) {
        var codes = ['let results =[];'];
        for (var _i = 0, frags_1 = frags; _i < frags_1.length; _i++) {
            var frag = frags_1[_i];
            if (!frag.isCode) {
                codes.push("results.push(`" + frag.value + "`);");
            }
            else {
                codes.push(frag.value);
            }
        }
        codes.push("return results.join('')");
        return codes.join("\n");
    };
    LiteTmplate.prototype.genFunction = function (code) {
        return new Function('data', code);
    };
    LiteTmplate.prototype.Deal = function (data) {
        return this.func(data);
    };
    return LiteTmplate;
}());
exports.LiteTmplate = LiteTmplate;
function test() {
    var TPL_SAMPLE = "\n<html>\n<% for(file of data.files){ %>\n    <tr>\n        <td>{{file.name}}</td>\n        <td>{{file.size}}></td>\n    </tr>\n<% } %>\n</html>\n";
    var tpl = new LiteTmplate(TPL_SAMPLE);
    console.log(tpl.Deal({ files: [{ name: "1.txt", size: 100 }, { name: "2.txt", size: 23 }] }));
}
exports.test = test;
//# sourceMappingURL=myjs.tpl.js.map