type TplFrag = {
    isCode: boolean;
    value: string
}

export class JTpl {
    private func: Function;
    constructor(tpl: string) {
        let lines = this.parseTpl(tpl);
        let code = this.genTplCode(lines);
        this.func = this.genFunction(code);
    }

    private parseTpl(tpl: string): TplFrag[] {
        let tplLines = [];                 //返回的数组，用于保存匹配结果
        let regExp = /<%([\s\S]*?)%>/g;  //用于匹配js代码的正则 <%%>里面加入代码
        let match;   				  //当前匹配到的match
        let index = 0;			  //当前匹配到的索引     

        //tpl = tpl.replace(/<%=([\s\S]*?)%>/g,"${$1}"); // <%= %> 模板格式
        tpl = tpl.replace(/{{([\s\S]*?)}}/g, "${$1}"); // {{}} 模板格式,此格式更易读,更适合嵌入html标签中

        while (match = regExp.exec(tpl)) {
            // 保存当前匹配项之前的普通文本/占位
            tplLines.push({ isCode: false, value: tpl.substring(index, match.index) })
            tplLines.push({ isCode: true, value: match[1] });
            //更新当前匹配索引
            index = match.index + match[0].length;
        }
        //保存文本尾部
        tplLines.push({ isCode: false, value: tpl.substr(index) });
        return tplLines;
    }

    private genTplCode(frags: TplFrag[]) {
        let codes = ['let results =[];'];
        for (let frag of frags) {
            if (!frag.isCode) {
                codes.push(`results.push(\`${frag.value}\`);`);
            } else {
                codes.push(frag.value);
            }
        }
        codes.push("return results.join('')");
        return codes.join("\n");
    }
    private genFunction(code: string): Function {
        return new Function('data', code);
    }
    public Deal(data: object): string {
        return this.func(data);
    }
}

function test() {
    const TPL_SAMPLE = `
<html>
<% for(file of data.files){ %>
    <tr>
        <td>{{file.name}}</td>
        <td>{{file.size}}></td>
    </tr>
<% } %>
</html>
`
    let tpl = new JTpl(TPL_SAMPLE);
    console.log(tpl.Deal({ files: [{ name: "1.txt", size: 100 }, { name: "2.txt", size: 23 }] }));
}
//test();