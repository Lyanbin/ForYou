const fs = require('fs');
const path = require('path');

function Svg2VueComponent(options) {
  this.svgDir = options.svgDir;
  this.outSvgJsDir = options.outSvgJsDir;
}


Svg2VueComponent.prototype.apply = function (compiler) {
  let self = this;
  if (!self.svgDir) {
    throw new Error(`Invalid directory of svgDir: ${self.svgDir}`);
  }
  if (!self.outSvgJsDir) {
    throw new Error(`Invalid directory of outSvgJsDir: ${self.outSvgJsDir}`);
  }
  compiler.plugin('compile', function (params) {
    console.log("The compiler in Svg2VueComponent is starting to compile............");
    init(self);
  });
}

function init(self) {
  // 删除require缓存
  delete require.cache[self.svgDir];

  // const lavasConfig = require(lavasConfigPath);
  // const iconConfig = lavasConfig.icon;
  const svgDir = self.svgDir;
  const outSvgJsDir = self.outSvgJsDir;
  const PATH_REG = / d="([^"]+)"/g;

  // 验证`assets/svg`文件夹
  try {
    if (!fs.statSync(svgDir).isDirectory()) {
      throw new Error(`Invalid directory of svg: ${svgDir}`);
    }
  }
  catch (err) {
    throw new Error(err);
  }
  // 创建输出文件夹
  if (!fs.existsSync(outSvgJsDir)) {
    let dirArr = outSvgJsDir.split('/');
    let pathtmp = '/';

    dirArr.forEach((item) => {
      pathtmp = path.join(pathtmp, item);
      if (!fs.existsSync(pathtmp)) {
        fs.mkdirSync(pathtmp);
      }
    });
  }

  function packageData(svgPath, outputDir) {
    fs.readdirSync(svgPath).forEach(file => {
      let filePath = path.resolve(svgPath, file);
      // 递归
      if (fs.statSync(filePath).isDirectory()) {
        let targetDir = path.resolve(outputDir, file);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir);
        }
        return packageData(filePath, targetDir);
      }

      let svg = fs.readFileSync(filePath, 'utf8');
      let sizeMatch = svg.match(/ viewBox="0 0 (\d+) (\d+)"/);
      if (!sizeMatch) {
        return;
      }
      let dMatch;
      let paths = [];
      let svgName = path.basename(file, path.extname(file));
      // 匹配多个 <path d=""> 路径
      while (dMatch = PATH_REG.exec(svg)) {
        paths.push({
          d: dMatch[1]
        });
      }

      // 注册使用到的svg
      let svgJsCodeStr = `
            import Icon from 'vue-awesome/components/Icon.vue';
            Icon.register(
                {
                    '${svgName}': {
                        width: ${parseInt(sizeMatch[1], 10)},
                        height: ${parseInt(sizeMatch[2], 10)},
                        paths: ${JSON.stringify(paths)}
                    }
            });`;
      fs.writeFile(outputDir + `/${svgName}.js`, svgJsCodeStr, function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(`Icon ${outputDir}/${svgName}.js is saved`);
      });
    });
  }

  packageData(svgDir, outSvgJsDir);

  return true;
};


module.exports = Svg2VueComponent;