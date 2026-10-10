export const collections = [
  {
    id: "seating",
    name: "坐具",
    image: "images/banners/seating.jpg",
    position: "center",
  },
  {
    id: "lighting",
    name: "灯具",
    image: "images/banners/lighting.jpg",
    position: "18% 42%",
  },
  {
    id: "table",
    name: "餐桌",
    image: "images/banners/table.jpg",
    position: "center",
  },
  {
    id: "home",
    name: "家居",
    image: "images/banners/home.jpg",
    position: "center",
  },
];

export const products = [
  {
    id: "velvet-sofa",
    name: "墨绿色丝绒双人沙发",
    price: 890,
    collection: "seating",
    image: "images/products/velvet-sofa.jpg",
    position: "center",
    summary: "墨绿色丝绒双人沙发，两块靠背，两侧各一只圆筒靠枕，四只浅木脚。",
    inbox: "沙发一只，含两块靠背和两只圆筒靠枕。",
    scene: "白墙、木地板和墙上的插座是房间，不随货。",
    care: "干软布除尘。避免长时间日晒。",
    reviews: [
      {
        name: "陈可欣",
        role: "室内设计师",
        text: "颜色和页面一致，到货就是那只墨绿色。圆筒靠枕也在。",
      },
      {
        name: "梁启言",
        role: "建筑师",
        text: "两人坐刚好。木脚比照片里看起来更浅一点，丝绒是对的。",
      },
    ],
  },
  {
    id: "brown-sofa",
    name: "棕色皮纹双人沙发",
    price: 1280,
    collection: "seating",
    image: "images/products/brown-sofa.jpg",
    position: "72% center",
    summary: "棕色皮纹双人沙发，两只靠垫，黑色细金属脚。",
    inbox: "沙发一只，含两只靠垫。",
    scene: "玻璃瓶、芦苇、深色格子毯和藤格屏风是陈列，不随货。",
    care: "用微湿软布擦拭，不要用酒精。",
    reviews: [
      {
        name: "周曼宁",
        role: "平面设计师",
        text: "皮纹是哑光的，不是亮面。金属脚和照片里一样细。",
      },
    ],
  },
  {
    id: "grey-sofa",
    name: "灰色拉扣三人布沙发",
    price: 960,
    collection: "seating",
    image: "images/products/grey-sofa.jpg",
    position: "center",
    summary: "灰色布面三人沙发，靠背有拉扣，深色木脚。",
    inbox: "沙发一只。靠垫不包含。",
    scene: "青色靠垫、条纹靠垫、茶几、落地灯和窗边的猫都不随货。",
    care: "用吸尘器的软刷头清理。污渍及时用干布按压。",
    reviews: [
      {
        name: "何柏霖",
        role: "咖啡店主理人",
        text: "三人位名副其实，拉扣在靠背上。布料是中灰，不是米灰。",
      },
    ],
  },
  {
    id: "cream-chair",
    name: "米白色拉扣单人椅",
    price: 420,
    collection: "seating",
    image: "images/products/cream-chair.jpg",
    position: "center",
    summary: "米白色拉扣单人椅，坐垫一圈软包。前腿是白色车木，后腿是细弯腿。",
    inbox: "椅子一只。",
    scene: "纯色背景不随货。",
    care: "避免沾水。除尘用软毛刷。",
    reviews: [
      {
        name: "林晓桐",
        role: "编辑",
        text: "比普通餐椅软。拉扣和车木腿都在，颜色是暖白米。",
      },
    ],
  },
  {
    id: "black-chair",
    name: "黑色壳面浅木脚餐椅",
    price: 168,
    collection: "seating",
    image: "images/products/black-chair.jpg",
    position: "32% 42%",
    summary: "黑色塑料壳餐椅，浅色木脚四只。照片下沿裁掉了脚的末端，实物脚是完整的。",
    inbox: "椅子一只。",
    scene: "灰绿背景不随货。",
    care: "壳面用湿布擦干。",
    reviews: [
      {
        name: "黄子澄",
        role: "教师",
        text: "壳是哑光黑，脚是浅木。坐下去比看起来稳。",
      },
    ],
  },
  {
    id: "floor-lamp",
    name: "灰色金属罩落地灯",
    price: 149,
    collection: "lighting",
    image: "images/products/floor-lamp.jpg",
    position: "16% 40%",
    summary: "灰色金属落地灯，弯管，喇叭形灯罩，罩侧有一颗调节旋钮。照片只拍到灯的上半段。",
    inbox: "落地灯一只，含灯泡座。灯泡需另配 E27。",
    scene: "白墙不随货。",
    care: "断电后再擦金属表面。",
    reviews: [
      {
        name: "吴凯晴",
        role: "产品经理",
        text: "灯罩是深灰，不是黑色。旋钮可以改角度，和照片一致。",
      },
    ],
  },
  {
    id: "pendant",
    name: "白色宽罩金属吊灯",
    price: 128,
    collection: "lighting",
    image: "images/products/pendant.jpg",
    position: "center 32%",
    summary: "白色金属宽罩吊灯，黑色吊线和黑色灯头。",
    inbox: "吊灯一只。安装配件在盒内。灯泡需另配。",
    scene: "水泥桌、玻璃杯和盆栽不随货。",
    care: "断电后用干布擦罩。",
    reviews: [
      {
        name: "邓乐言",
        role: "摄影师",
        text: "罩是哑光白，内壁更亮。吊线是黑色的，长度够一张餐桌。",
      },
    ],
  },
  {
    id: "arc-lamp",
    name: "银色弧形落地灯",
    price: 420,
    collection: "lighting",
    image: "images/products/arc-lamp.jpg",
    position: "center 34%",
    summary: "银色金属弧形落地灯，半球形灯罩。",
    inbox: "落地灯一只。",
    scene: "圆桌、木椅、白毯和盆栽是房间陈设，不随货。",
    care: "用干布擦金属杆。调节弧度时扶住底座。",
    reviews: [
      {
        name: "陈可欣",
        role: "室内设计师",
        text: "弧杆和半球罩都是银色。灯能罩到一张小圆桌。",
      },
    ],
  },
  {
    id: "round-mug",
    name: "白色圆肚陶瓷杯",
    price: 18,
    collection: "table",
    image: "images/products/round-mug.jpg",
    position: "20% 58%",
    summary: "白色陶瓷圆肚杯，空杯，杯把在右侧。",
    inbox: "杯子一只。",
    scene: "台面和背景不随货。",
    care: "手洗。不要从冰箱直接倒开水。",
    reviews: [
      {
        name: "何柏霖",
        role: "咖啡店主理人",
        text: "杯身是圆的，比直筒杯好握。釉面亮，照片没有夸张。",
      },
    ],
  },
  {
    id: "straight-mug",
    name: "白色直筒马克杯",
    price: 22,
    collection: "table",
    image: "images/products/straight-mug.jpg",
    position: "center",
    summary: "白色陶瓷直筒马克杯，杯把在右侧。",
    inbox: "杯子一只。",
    scene: "杯里的饮料、两块饼干和木垫是摆拍，不随货。",
    care: "手洗。",
    reviews: [
      {
        name: "林晓桐",
        role: "编辑",
        text: "直筒，容量够一杯拿铁。饼干当然没寄来，杯子是对的。",
      },
    ],
  },
  {
    id: "cup-set",
    name: "斑点陶瓷杯五件组",
    price: 68,
    collection: "table",
    image: "images/products/cup-set.jpg",
    position: "32% center",
    summary: "五只杯子：高杯一只，上段米色黑点、下段焦糖色；前方白杯一只；浅灰釉杯三只。",
    inbox: "杯子五只，如图。",
    scene: "白色台面不随货。",
    care: "手洗。釉面斑点是烧制效果，每只位置不完全一样。",
    reviews: [
      {
        name: "周曼宁",
        role: "平面设计师",
        text: "五只都在。高杯下半段是焦糖色，小白杯釉是亮的。",
      },
    ],
  },
  {
    id: "bottle",
    name: "雾面绿色水瓶",
    price: 34,
    collection: "table",
    image: "images/products/bottle.jpg",
    position: "center",
    summary: "雾面绿色圆柱水瓶，同色盖，底部有一圈接缝。",
    inbox: "水瓶一只。",
    scene: "背景不随货。",
    care: "手洗瓶身。盖子不要长时间浸泡。",
    reviews: [
      {
        name: "吴凯晴",
        role: "产品经理",
        text: "绿色是偏橄榄的雾面，盖子同色。站得很稳。",
      },
    ],
  },
  {
    id: "pillow",
    name: "白色绗缝枕",
    price: 32,
    collection: "home",
    image: "images/products/pillow.jpg",
    position: "center 74%",
    summary: "白色绗缝枕一只，枕边有细密车线。",
    inbox: "枕头一只。",
    scene: "黄色背景和白色台面不随货。",
    care: "枕套可拆下轻柔水洗，枕芯阴干。",
    reviews: [
      {
        name: "黄子澄",
        role: "教师",
        text: "就是照片里那只白枕头，绗缝线很清楚。偏软。",
      },
    ],
  },
  {
    id: "candle",
    name: "玻璃杯蜡烛",
    price: 24,
    collection: "home",
    image: "images/products/candle.jpg",
    position: "center",
    summary: "透明玻璃杯蜡烛，蜡色偏暖白。照片里的蜡烛是点燃状态。",
    inbox: "蜡烛一只，含玻璃杯。",
    scene: "旁边的小盆栽、白色毛毯和灯串不随货。",
    care: "放在耐热平面上燃烧，人离开房间就熄灭。",
    reviews: [
      {
        name: "邓乐言",
        role: "摄影师",
        text: "杯子是直筒玻璃，蜡是暖白色。到货时没有点燃。",
      },
    ],
  },
  {
    id: "plant",
    name: "薄荷绿陶盆条纹十二卷",
    price: 28,
    collection: "home",
    image: "images/products/plant.jpg",
    position: "center",
    summary: "条纹十二卷一株，叶片有白色横纹，连薄荷绿陶盆一起卖。",
    inbox: "植株一盆，含陶盆和土。",
    scene: "白色背景不随货。",
    care: "土干透再浇。放在散射光下，不要积水。",
    reviews: [
      {
        name: "林晓桐",
        role: "编辑",
        text: "盆是薄荷绿，叶子上的白点白纹和照片一样。",
      },
    ],
  },
];

export const homeIds = [
  "velvet-sofa",
  "round-mug",
  "floor-lamp",
  "cup-set",
  "cream-chair",
  "candle",
  "pendant",
  "bottle",
];

export const featureId = "grey-sofa";

export function formatPrice(amount) {
  return "US$" + amount.toLocaleString("en-US");
}

export function getProduct(id) {
  return products.find((item) => item.id === id);
}

export function getCollection(id) {
  return collections.find((item) => item.id === id);
}

export function productsIn(collectionId) {
  return products.filter((item) => item.collection === collectionId);
}
