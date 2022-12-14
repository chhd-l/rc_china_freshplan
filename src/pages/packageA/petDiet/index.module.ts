export const formulaData: FormulaData[] = [
  {
    name: '牛肉泥',
    Ingredients: '牛肉 土豆 鸡蛋 胡萝卜 豌豆',
    calorie: '1479大卡/公斤，201大卡/杯ME',
    Ingredientlist: [['粗蛋白质', '8%以上'], ['粗脂肪', '4%以上'], ['粗纤维', '最大2%'], ['水分', '最大75%']],
    crudeProtein: '55',
    crudeFat: '93',
    image: 'niurou.png',
    mixedIngredients: '碎牛肉、赤褐色土豆、鸡蛋、胡萝卜、豌豆、磷酸二钙、氯化钾、盐、天然香料、柠檬酸、碳酸钙、牛磺酸、醋、鱼油、葵花籽油、酒石酸氢胆碱、加工用水量、铁氨基酸螯合物、葡萄糖酸锌、维生素 E 补充剂、葡萄糖酸铜、烟酸（维生素 B3）、葡萄糖酸锰、维生素 A 补充剂、硫胺素（维生素 B1）、盐酸吡哆醇（维生素 B6）、核黄素（维生素 B2）、胆钙化醇（来源维生素 D3)、碘化钾、叶酸、维生素 B12 补充剂。'
  },
  {
    name: '鸡肉料理',
    Ingredients: '鸡肉 红薯 南瓜 菠菜',
    calorie: '1255大卡/公斤，206大卡/杯ME',
    Ingredientlist: [['粗蛋白质', '8. 5%以上'], ['粗脂肪', '6%以上'], ['粗纤维', '最大1%'], ['水分', '最大77%']],
    crudeProtein: '54',
    crudeFat: '88',
    image: 'jirou.png',
    mixedIngredients: '鸡丁、红薯、南瓜、菠菜、加工用水、葵花油、菜籽油、磷酸二钙、醋、天然香料、柠檬酸、碳酸钙、鱼油、酒石酸氢胆碱、牛磺酸、铁氨基酸螯合物、葡萄糖酸锌、维生素 E 补充剂、葡萄糖酸铜、烟酸（维生素 B3）、葡萄糖酸锰、维生素 A 补充剂、单硝酸硫胺素（维生素 B1）、盐酸吡哆醇（维生素 B6）、核黄素（维生素 B2）、胆钙化醇（维生素 D3 的来源） 、碘化钾、叶酸、维生素B12补充剂。'
  },
  {
    name: '猪肉便饭',
    Ingredients: '猪肉 土豆 青豆 南瓜 羽衣甘蓝 蘑菇',
    calorie: '1479大卡/公斤，201大卡/杯ME',
    Ingredientlist: [['粗蛋白质', '8%以上'], ['粗脂肪', '4%以上'], ['粗纤维', '最大2%'], ['水分', '最大75%']],
    crudeProtein: '58',
    crudeFat: '92',
    image: 'zhurou.png',
    mixedIngredients: '猪肉碎、赤褐色土豆、青豆、南瓜、羽衣甘蓝、白蘑菇、磷酸二钙、氯化钾、盐、天然香料、柠檬酸、鱼油、醋、牛磺酸、酒石酸氢胆碱、氨基酸螯合铁、葡萄糖酸锌、维生素 E 补充剂、葡萄糖酸铜、烟酸（维生素 B3）、葡萄糖酸锰、维生素 A 补充剂、单硝酸硫胺素（维生素 B1）、盐酸吡哆醇（维生素 B6）、核黄素（维生素 B2）、胆钙化醇（维生素 D3 的来源）、碘化钾、叶酸、维生素B12补充。'
  },
  {
    name: '火鸡料理',
    Ingredients: '火鸡 糙米 鸡蛋 胡萝卜 菠菜',
    calorie: '1479大卡/公斤，201大卡/杯ME',
    Ingredientlist: [['粗蛋白质', '10%以上'], ['粗脂肪', '5%以上'], ['粗纤维', '最大1%'], ['水分', '最大72%']],
    crudeProtein: '46',
    crudeFat: '91',
    image: 'huoji.png',
    mixedIngredients: '火鸡粉、糙米、鸡蛋、胡萝卜、菠菜、磷酸二钙、碳酸钙、柠檬酸、氯化钾、盐、加工用水、鱼油、酒石酸氢胆碱、天然香料、醋、氨基酸螯合铁、牛磺酸、葡萄糖酸锌、维生素 E 补充剂、葡萄糖酸铜、烟酸（维生素 B3）、葡萄糖酸锰、维生素 A 补充剂、单硝酸硫胺素（维生素 B1）、盐酸吡哆醇（维生素 B6）、核黄素（维生素 B2）、胆钙化醇（维生素 D3 的来源)、碘化钾、叶酸、维生素B12补充剂。'
  }

]



export type FormulaData = {
  name: string;
  Ingredients: string;
  calorie: string;
  Ingredientlist: string[][];
  crudeProtein: string;
  crudeFat: string;
  mixedIngredients: string;
  image: string
}