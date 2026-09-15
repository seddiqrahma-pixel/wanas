
/* ====================== i18n ====================== */
const I18N = {
  ar:{
    brand:"وَنَس", brand_en:"وَنَس", admin:"لوحة التحكم", cart:"السلة",
    hero_title:"راحة بالك تبدأ من هنا", hero_sub:"منتجات وَنَس — جودة تهدي بالك",
    products:"المنتجات", admin_panel:"إدارة الأصناف والمنتجات",
    admin_hint:"التغييرات محفوظة على جهازك فقط (LocalStorage)",
    cats:"الأصناف (Categories)", add_cat:"+ إضافة صنف",
    prods:"المنتجات (Products)", add_prod:"+ إضافة منتج",
    reset:"استعادة البيانات الافتراضية",
    total:"الإجمالي", checkout:"إتمام الطلب",
    order_title:"تأكيد الطلب", pay_method:"طريقة الدفع",
    cust_name:"الاسم", cust_phone:"رقم الهاتف", cust_addr:"العنوان (للشحن)", cust_note:"ملاحظات",
    send_order:"إرسال الطلب (واتساب)", send_mail:"إرسال عبر الإيميل",
    cat_ar_ph:"اسم الصنف بالعربي", cat_en_ph:"اسم الصنف (إنجليزي)",
    prod_ar_ph:"اسم المنتج عربي", prod_en_ph:"اسم المنتج (إنجليزي)",
    prod_desc_ar_ph:"وصف عربي", prod_desc_en_ph:"وصف (إنجليزي)",
    price_ph:"السعر", emoji_ph:"إيموجي/رابط صورة", imgs_ph:"صور المنتج (مسار أو رابط — افصل بفاصلة/سطر جديد)", prod_imgs_label:"صور المنتج — افصل بين كل صورة بفاصلة أو سطر جديد (Images — separate with comma or newline)",
    name_ph:"اكتب اسمك", phone_ph:"01xxxxxxxxx", addr_ph:"المحافظة / العنوان التفصيلي",
    note_ph:"أي ملاحظة على الطلب",
    empty_cart:"السلة فاضية", empty_store:"لا توجد منتجات بعد",
    add:"أضف للسلة", remove:"حذف", edit:"تعديل", delete:"مسح",
 all:"الكل", save:"حفظ", cancel:"إلغاء",
 edit_product:"تعديل المنتج", edit_category:"تعديل الصنف",
    pay_vod:"فودافون كاش", pay_vod_det:"حول المبلغ على الرقم",
    pay_inst:"إنستا باي", pay_inst_det:"التحويل لاسم المستخدم",
    pay_bank:"تحويل بنكي", pay_bank_det:"بيانات الحساب البنكي",
    pay_wa:"طلب عبر واتساب", pay_wa_det:"بدون دفع أونلاين — نراجع طلبك ونأكد",
    order_sent:"تم تجهيز رسالة الطلب ✅", fill_fields:"املى البيانات المطلوبة أولاً",
    login_ok:"تم الدخول للوحة التحكم", login_fail:"كلمة السر غلط", password_changed:"تم تغيير كلمة الدخول بنجاح",
    confirm_reset:"متأكد إنك عايز ترجع البيانات الافتراضية؟",
    no_pay:"اختار طريقة دفع",
    admin_login_title:"دخول لوحة التحكم", admin_pass_ph:"كلمة الدخول", admin_login_btn:"دخول",
    social_instagram:"إنستجرام", social_facebook:"فيسبوك", social_facebook_brand:"وَنَس", footer_tagline:"شُمُوعٌ تَمْنَحُكَ دَفْءَ الشَّمْسِ 🕯️",
    settings:"الإعدادات", settings_hint:"كل التغييرات تُحفظ على جهازك فقط",
    tab_branding:"الشعار والكلمات", tab_password:"كلمة الدخول", tab_market:"سعر السوق والخصم", tab_payment:"الدفع وطرق التواصل",
    brand_logo:"الشعار", brand_name_title:"الكلمة جنب الشعار", hero_title:"كلمة الأعلى", hero_sub:"الكلمة تحت العنوان", footer:"كلمة الأسفل",
    brand_ar:"الاسم عربي", brand_en:"الاسم إنجليزي",
    logo_path:"مسار شعار الصفحة", logo_icon_path:"مسار أيقونة التذييل",
    font:"الخط", size:"الحجم", color:"اللون", color_brand:"لون الكلمة", color_brand2:"خلفية الفعّال", color_line:"الحد",
    color_sub:"لون الكلمة تحتها", color_muted:"لون النص",
    hero_title_ar:"العنوان عربي", hero_title_en:"العنوان إنجليزي",
    hero_sub_ar:"تحت العنوان عربي", hero_sub_en:"تحت العنوان إنجليزي",
    footer_ar:"الكلمة عربي", footer_en:"الكلمة إنجليزي",
    cat_tabs_style_title:"مظهر أزرار الأصناف",
    change_password:"تغيير كلمة الدخول", current_pass:"كلمة الدخول الحالية", new_pass:"كلمة دخول جديدة", confirm_pass:"تأكيد كلمة الدخول",
    wrong_attempts_title:"محاولات دخول فاشلة", reset_wrong_attempts:"إعادة ضبط العداد",
    market_title:"سعر السوق والخصم لكل منتج", market_hint:"أدخل سعر السوق — لو كان سعرك أقل بيظهر خصم تلقائي على المنتج.",
    market_price:"سعر السوق", market_cost:"التكلفة", market_profit:"الربح", market_ph:"سعر السوق (اختاري عشان يظهر الخصم)",
    payment_info_title:"معلومات الدفع", vodafone_cash:"فودافون كاش", instapay:"إنستا باي", bank_transfer:"تحويل بنكي", whatsapp_number:"واتساب", email:"بريدك الإلكتروني",
    comm_methods_title:"طرق التواصل اللي بتظهر في الأسفل", comm_methods_hint:"أضف/عدّل/حذف طرق التواصل.",
    comm_icon:"أيقونة (إيموجي)", comm_name_ar:"الاسم عربي", comm_name_en:"الاسم إنجليزي", comm_value:"الرابط أو الرقم",
    comm_type:"النوع", comm_type_social:"ارتباط خارجي", comm_type_contact:"اتصال", comm_type_text:"نص عام",
    add:"إضافة", delete:"حذف", edit:"تعديل", save:"حفظ", cancel:"إلغاء",
    wrong_pwd:"كلمة الدخول غلط — حاول تاني", unlocks:"فتحات الراسبيد", wrong_attempts_info:"كل محاولة خاطئة بتُحسب. العداد بيعمل كماكينة حماية ضد المشاكل.",
    publish_to_github:"نشر على GitHub", publish_data:"البيانات اللي هتُنشر", publish_when:"لما تشتغل الزر، بيجيب كل الأصناف والمنتجات والإعدادات اللي في الجهاز ويحطها في ملف data.json على GitHub — وفعّلها على موقع GitHub Pages.", github_token:"Token GitHub (repo)",
    publish_msg:"تم النشر", publish_err:"مفزرش — تديك لا يوجد",
    product_market:"سعر السوق", product_cost:"التكلفة", product_profit:"الربح", product_discount:"خصم",
    product_no_market:"—",
    market_ph:"Market price (set to show discount)",
    gh_title:"نشر على جيت هب", gh_hint:"حطّ التوكين واسم المستخدم والمستودع، ثم اضغط Publish عشان ترسل التغييرات للsite يعيش.",
    gh_token:"توكين جيت هب", gh_token_ph:"ghp_xxx…", gh_owner:"اسم المستخدم", gh_repo:"اسم المستودع",
    gh_btn:"نشر على جيت هب", gh_status:"جارٍ...", gh_ok:"✓ تم النشر", gh_err:"خطأ — حاول تاني",
    gh_save:"حفظ التوكين", gh_clear:"مسح", gh_need:"مش مدينيهم كل الحقول", gh_warning:"التوكين بيتحفظ على متصفحك بس — أي حد يفتح الصفحة يقراها."
  },
  en:{
    brand:"Wanas", brand_en:"Wanas", admin:"Admin Panel", cart:"Cart",
    hero_title:"Peace of mind starts here", hero_sub:"Wanas products — quality that soothes your soul",
    products:"Products", admin_panel:"Manage Categories & Products",
    admin_hint:"Changes are saved on your device only (LocalStorage)",
    cats:"Categories", add_cat:"+ Add Category",
    prods:"Products", add_prod:"+ Add Product",
    reset:"Restore default data",
    total:"Total", checkout:"Checkout",
    order_title:"Confirm Order", pay_method:"Payment Method",
    cust_name:"Name", cust_phone:"Phone", cust_addr:"Address (shipping)", cust_note:"Notes",
    send_order:"Send order (WhatsApp)", send_mail:"Send via Email",
    cat_ar_ph:"Category name (Arabic)", cat_en_ph:"Category name (English)",
    prod_ar_ph:"Product name (Arabic)", prod_en_ph:"Product name (English)",
    prod_desc_ar_ph:"Description (Arabic)", prod_desc_en_ph:"Description (English)",
    price_ph:"Price", emoji_ph:"Emoji/Image URL", imgs_ph:"Product images (path or URL — separate with comma/newline)", prod_imgs_label:"Product Images — separate each image with a comma or newline (صور المنتج — افصل بفاصلة أو سطر جديد)",
    name_ph:"Enter your name", phone_ph:"01xxxxxxxxx", addr_ph:"Governorate / detailed address",
    note_ph:"Any note about the order",
    empty_cart:"Cart is empty", empty_store:"No products yet",
    add:"Add", remove:"Remove", edit:"Edit", delete:"Delete",
    all:"All", save:"Save", cancel:"Cancel",
    edit_product:"Edit Product", edit_category:"Edit Category",
    pay_vod:"Vodafone Cash", pay_vod_det:"Transfer the amount to the number",
    pay_inst:"InstaPay", pay_inst_det:"Transfer to the username",
    pay_bank:"Bank Transfer", pay_bank_det:"Bank account details",
    pay_wa:"Order via WhatsApp", pay_wa_det:"No online payment — we review and confirm your order",
    order_sent:"Order message ready ✅", fill_fields:"Fill the required fields first",
    login_ok:"Logged in to control panel", login_fail:"Wrong password", password_changed:"Password changed successfully",
    confirm_reset:"Sure you want to restore default data?",
    no_pay:"Choose a payment method",
    admin_login_title:"Admin Login", admin_pass_ph:"Password", admin_login_btn:"Login",
    social_instagram:"Instagram", social_facebook:"Facebook", social_facebook_brand:"Wanas", footer_tagline:"Candles that give you the comfort of the sun 🕯️",
    settings:"Settings", settings_hint:"All changes are saved on your device only",
    tab_branding:"Logo & Words", tab_password:"Password", tab_market:"Market Price & Discount", tab_payment:"Payment & Contact",
    brand_logo:"Logo", brand_name_title:"Brand word next to logo", hero_title:"Top hero heading", hero_sub:"Sub heading under hero", footer:"Footer tagline",
    brand_ar:"Name (Arabic)", brand_en:"Name (English)",
    logo_path:"Page logo path (logo.png)", logo_icon_path:"Footer icon path (logo-icon.png)",
    font:"Font", size:"Size", color:"Color", color_brand:"Word color", color_brand2:"Active background", color_line:"Border",
    color_sub:"Sub text color", color_muted:"Muted text color",
    hero_title_ar:"Heading Arabic", hero_title_en:"Heading English",
    hero_sub_ar:"Sub heading Arabic", hero_sub_en:"Sub heading English",
    footer_ar:"Tagline Arabic", footer_en:"Tagline English",
    cat_tabs_style_title:"Category tabs style",
    change_password:"Change password", current_pass:"Current password", new_pass:"New password", confirm_pass:"Confirm password",
    wrong_attempts_title:"Failed login attempts", reset_wrong_attempts:"Reset counter",
    market_title:"Market price & discount per product", market_hint:"Enter the market price — if your price is lower, a discount badge shows automatically.",
    market_price:"Market price", market_cost:"Cost", market_profit:"Profit",
    payment_info_title:"Payment info", vodafone_cash:"Vodafone Cash", instapay:"InstaPay", bank_transfer:"Bank transfer", whatsapp_number:"WhatsApp", email:"Your email",
    comm_methods_title:"Contact methods shown on site", comm_methods_hint:"Add / edit / remove contact methods shown on the footer.",
    comm_icon:"Icon (emoji)", comm_name_ar:"Name (Arabic)", comm_name_en:"Name (English)", comm_value:"Link or number",
    comm_type:"Type", comm_type_social:"External link", comm_type_contact:"Contact (number)", comm_type_text:"Plain text",
    add:"Add", delete:"Delete", edit:"Edit", save:"Save", cancel:"Cancel",
    wrong_pwd:"Wrong password — try again", unlocks:"Unlock count", wrong_attempts_info:"Each wrong attempt is counted. It acts like a lockout guard.",
    product_market:"Market price", product_cost:"Cost", product_profit:"Profit", product_discount:"Discount", product_no_market:"—",
    publish_to_github:"Publish to GitHub", publish_data:"Data to push", publish_when:"When you click this, the button grabs all categories, products, and settings off your current device and writes them into a data.json file on GitHub — so the live GitHub Pages build can pick up your changes.",
    github_token:"GitHub token (repo)", publish_msg:"Published", publish_err:"Publish failed — check the console",
    gh_title:"Publish to GitHub", gh_hint:"Enter your token, username, and repo, then press Publish to push your changes live.",
    gh_token:"GitHub token", gh_token_ph:"ghp_xxx...", gh_owner:"Username", gh_repo:"Repository",
    gh_btn:"Publish", gh_status:"publishing…", gh_ok:"✓ published", gh_err:"error — try again",
    gh_save:"save token", gh_clear:"clear", gh_need:"please fill all fields", gh_warning:"The token is saved in your browser only — anyone who opens this page can read it."
  }
};
let LANG = localStorage.getItem("wanas_lang") || "ar";

/* ====================== Payment config ====================== */
const PAYMENT = {
  vodafone:"01020306395",      // فودافون كاش
  instapay:"01020306395",      // إنستا باي
  bank:"Bank: NBE\nIBAN: EG900003041450006160803000150", // بيانات الحساب البنكي
  whatsapp:"01020306395",      // واتساب استقبال الطلبات
  email:"ahmed.alghoraib@gmail.com" // الإيميل بتاعك
};

/* ====================== Default data ====================== */
function defaultData(){
  return {
    categories:[
      {id:"c1", ar:"شموع", en:"Candles"},
      {id:"c2", ar:"برطمانات", en:"Jars"},
      {id:"c3", ar:"هدايا", en:"Gifts"}
    ],
    products:[
      // شموع (Candles)
      {id:"p3", cat:"c1", ar:"وردة بلدي", en:"Baladi Rose Candle", descAr:"شمعة منحوتة على شكل وردة بلدي بألوان هادية ورائحة زهرية.", descEn:"Hand-carved baladi rose candle in soft tones with a floral scent.", price:78, imgs:["products/p_baladi_rose/main.jpg", "products/p_baladi_rose/g1.jpg", "products/p_baladi_rose/g2.jpg", "products/p_baladi_rose/g3.jpg", "products/p_baladi_rose/g4.jpg", "fb_photos/img_2.jpg", "fb_photos/img_3.jpg", "fb_photos/img_8.jpg", "fb_photos/img_11.jpg"]},
      {id:"p2", cat:"c1", ar:"سحابة وسط", en:"Cloud Candle (Medium)", descAr:"شمعة جيل على شكل سحابة بمشهد بحري — أجواء هدوء وراحة.", descEn:"Gel cloud candle with an ocean scene — calm, cozy vibes.", price:62, imgs:["products/p_cloud_mid/main.jpg", "products/p_cloud_mid/g1.jpg", "products/p_cloud_mid/g2.jpg"]},
      {id:"p4", cat:"c1", ar:"عدد 2 كلاسيك طويل", en:"Classic Long Candles (x2)", descAr:"شمعتان طويلتان كلاسيك مزينتان بقلوب حمراء — لكل المناسبات.", descEn:"Two long classic taper candles decorated with red hearts.", price:80, imgs:["products/p_classic_long_2/main.jpg", "products/p_classic_long_2/g1.jpg", "products/p_classic_long_2/g2.jpg", "products/p_classic_long_2/g3.jpg", "products/p_classic_long_2/g4.jpg"]},
      {id:"p5", cat:"c1", ar:"كرة صوف", en:"Wool Ball Candle", descAr:"شمعة على شكل كرة صوف برائحة دافئة تناسب الديكور المنزلي.", descEn:"Wool-ball shaped candle with a warm, cozy scent.", price:92, imgs:["products/p_wool_ball/main.jpg", "products/p_wool_ball/g1.jpg", "products/p_wool_ball/g2.jpg"]},
      {id:"p6", cat:"c1", ar:"سحابة كبيرة", en:"Cloud Candle (Large)", descAr:"شمعة جيل كبيرة على شكل سحابة بمشهد شاطئي — قطعة ديكور فريدة.", descEn:"Large gel cloud candle with a beach scene — a unique decor piece.", price:118, imgs:["products/p_cloud_big/main.jpg", "products/p_cloud_big/g1.jpg", "products/p_cloud_big/g2.jpg"]},
      {id:"p7", cat:"c1", ar:"موجة", en:"Wave Candle", descAr:"شمعة على شكل موجة بألوان هادية تضيف لمسة فنية لأي ركن.", descEn:"Wave-shaped candle in calm colors for an artistic touch.", price:132, imgs:["products/p_wave/main.jpg", "products/p_wave/g1.jpg", "products/p_wave/g2.jpg"]},
      {id:"p8", cat:"c1", ar:"وردة جوري كبير", en:"Large Jori Rose Candle", descAr:"شمعة وردة جوري كبيرة حمراء — قطعة ديكور جريئة تلفت النظر.", descEn:"Large red jori rose candle — a bold decor statement.", price:118, imgs:["products/p_big_rose/main.jpg", "products/p_big_rose/g1.jpg", "products/p_big_rose/g2.jpg", "products/p_big_rose/g3.jpg"]},
      {id:"p9", cat:"c1", ar:"بابل كبيرة", en:"Large Bubble Candle", descAr:"شمعة بابل كبيرة بشكل عصري — اختيار عصري لهدية مميزة.", descEn:"Large modern bubble candle — a stylish gift choice.", price:188, imgs:["products/p_bubble_big/main.jpg", "products/p_bubble_big/g1.jpg", "products/p_bubble_big/g2.jpg"]},
      {id:"p10", cat:"c1", ar:"فانوس", en:"Lantern Candle", descAr:"شمعة على شكل فانوس مع هلال — لمسة رمضانية دافئة.", descEn:"Lantern-shaped candle with crescent — a warm Ramadan touch.", price:188, imgs:["products/p_lantern/main.jpg", "products/p_lantern/g1.jpg", "products/p_lantern/g2.jpg"]},
      // برطمانات (Jars)
      {id:"p11", cat:"c2", ar:"برطمان 100", en:"Jar 100", descAr:"شمعة صويا في برطمان زجاجي 100 — رائحة طبيعية دافئة تحترق ببطء.", descEn:"Soy candle in a 100 jar with a warm natural scent that burns slowly.", price:230, imgs:["products/p_jar_100/main.jpg", "products/p_jar_100/g1.jpg", "products/p_jar_100/g2.jpg", "products/p_jar_100/g3.jpg"]},
      {id:"p12", cat:"c2", ar:"برطمان 150", en:"Jar 150", descAr:"شمعة صويا في برطمان زجاجي 150 بديكور زرعي طبيعي.", descEn:"Soy candle in a 150 jar with natural botanical decor.", price:300, imgs:["products/p_jar_150/main.jpg", "products/p_jar_150/g1.jpg", "products/p_jar_150/g2.jpg", "products/p_jar_150/g3.jpg"]},
      {id:"p13", cat:"c3", ar:"بونبونيره 75", en:"Bonbonniere 75", descAr:"بونبونيره وردية بحامل خشبي — هدية زفاف أو مناسبة مميزة.", descEn:"Pink rose bonbonniere on a wooden stick — a wedding or occasion favor.", price:196, imgs:["products/p_bonboniere_75/main.jpg", "products/p_bonboniere_75/g1.jpg", "products/p_bonboniere_75/g2.jpg", "products/p_bonboniere_75/g3.jpg", "products/p_bonboniere_75/g4.jpg"]},
      {id:"p14", cat:"c2", ar:"برطمان 250", en:"Jar 250", descAr:"شمعة صويا فاخرة في برطمان خشبي 250 بلمسة ذهبية.", descEn:"Premium soy candle in a wooden-lid 250 jar with a gold touch.", price:440, imgs:["products/p_jar_250/main.jpg", "products/p_jar_250/g1.jpg", "products/p_jar_250/g2.jpg", "products/p_jar_250/g3.jpg"]},
      {id:"p15", cat:"c2", ar:"برطمان 380", en:"Jar 380", descAr:"شمعة متعددة الفتائل في برطمان كبير 380 — إضاءة دافئة للغرف.", descEn:"Multi-wick soy candle in a large 380 jar — warm room lighting.", price:622, imgs:["products/p_jar_380/main.jpg", "products/p_jar_380/g1.jpg", "products/p_jar_380/g3.jpg", "products/p_jar_380/g4.jpg"]},
      // === new products from cost sheet (final 1125) ===
      {id:"p16", cat:"c1", ar:"فواحة استيك", en:"Steak Diffuser", descAr:"فواحة معطرة بنكهة استيك — لمسة مختلفة لجو منزلك.", descEn:"Scented diffuser with a unique steak aroma for a distinct home vibe.", price:26},
      {id:"p17", cat:"c1", ar:"بابل صغير", en:"Small Bubble Candle", descAr:"شمعة بابل صغيرة بشكل عصري — قطعة ديكور لطيفة.", descEn:"Small modern bubble candle — a cute decor piece.", price:54, imgs:["products/p_bubble_big/main.jpg", "products/p_bubble_big/g1.jpg", "products/p_bubble_big/g2.jpg"]},
      {id:"p18", cat:"c1", ar:"وردة جوري صغيرة", en:"Small Jori Rose Candle", descAr:"شمعة وردة جوري صغيرة حمراء — لمسة زهرية أنيقة.", descEn:"Small red jori rose candle — an elegant floral touch.", price:92, imgs:["products/p_big_rose/main.jpg", "products/p_big_rose/g1.jpg", "products/p_big_rose/g2.jpg", "products/p_big_rose/g3.jpg"]},
      {id:"p19", cat:"c3", ar:"بوكية 7 وردات", en:"7-Rose Bouquet Candle", descAr:"بوكة من 7 وردات مقفولة — هدية زهرية فاخرة.", descEn:"Bouquet of 7 closed roses — a luxury floral gift.", price:260},
      {id:"p20", cat:"c1", ar:"وردة بلدي 2", en:"Baladi Rose 2 (60g)", descAr:"شمعة وردة بلدي جديدة زن 60 جرام — رائحة زهرية هادية.", descEn:"New baladi rose candle, 60g, with a calm floral scent.", price:93, imgs:["products/p_baladi_rose/main.jpg", "products/p_baladi_rose/g1.jpg", "products/p_baladi_rose/g2.jpg", "products/p_baladi_rose/g3.jpg", "products/p_baladi_rose/g4.jpg"]},
      {id:"p21", cat:"c1", ar:"وردة توليب", en:"Tulip Candle (40g)", descAr:"شمعة على شكل وردة توليب زن 40 جرام — تصميم ناعم.", descEn:"Tulip-shaped candle, 40g, soft design.", price:72},
      {id:"p22", cat:"c1", ar:"صدفة 200 جرام", en:"Shell Candle 200g", descAr:"شمعة على شكل صدفة بحرية زن 200 جرام — قطعة ديكور مميزة.", descEn:"Sea-shell shaped candle, 200g — a unique decor piece.", price:370},
      {id:"p23", cat:"c1", ar:"فواحة مسطحة", en:"Flat Diffuser", descAr:"فواحة مسطحة جديدة — عطر هادئ يدوم.", descEn:"New flat diffuser with a long-lasting calm scent.", price:42, imgs:["products/p_wardrobe_diffuser/main.jpg", "products/p_wardrobe_diffuser/g1.jpg", "products/p_wardrobe_diffuser/g2.jpg", "products/p_wardrobe_diffuser/g3.jpg", "products/p_wardrobe_diffuser/g4.jpg"]},
      {id:"p24", cat:"c2", ar:"جار كونكريت 250 عسل", en:"Concrete Jar 250 (Honey)", descAr:"شمعة صويا في جار كونكريت 250 بعسل — لمسة طبيعية دافئة.", descEn:"Soy candle in a 250 concrete jar with honey wax — warm natural touch.", price:392},
      {id:"p25", cat:"c2", ar:"جار كونكريت 150 عسل", en:"Concrete Jar 150 (Honey)", descAr:"شمعة صويا في جار كونكريت 150 بعسل — ديكور عصري.", descEn:"Soy candle in a 150 concrete jar with honey wax — modern decor.", price:272},
      {id:"p26", cat:"c2", ar:"صدفة 200 عسل", en:"Shell 200g (Honey)", descAr:"شمعة صدفة 200 جرام بعسل — رائحة طبيعية دافئة.", descEn:"Shell candle 200g with honey wax — warm natural scent.", price:332},
      {id:"p27", cat:"c3", ar:"بونبونيره 75 عسل", en:"Bonbonniere 75 (Honey)", descAr:"بونبونيره وردية بحامل خشبي بعسل — هدية مناسبة مميزة.", descEn:"Pink honey bonbonniere on a wooden stick — a special occasion favor.", price:182, imgs:["products/p_bonboniere_75/main.jpg", "products/p_bonboniere_75/g1.jpg", "products/p_bonboniere_75/g2.jpg", "products/p_bonboniere_75/g3.jpg", "products/p_bonboniere_75/g4.jpg"]},
      {id:"p28", cat:"c1", ar:"قطارة 30 مللي", en:"Dropper 30ml", descAr:"قطارة عطر 30 مللي — رائحة مركزة تدوم.", descEn:"30ml fragrance dropper — concentrated long-lasting scent.", price:120},
      {id:"p30", cat:"c1", ar:"وردة قرنفل", en:"Carnation Rose Candle", descAr:"شمعة على شكل وردة قرنفل — رائحة زهرية هادئة.", descEn:"Carnation rose-shaped candle with a calm floral scent.", price:54, imgs:["products/p_baladi_rose/main.jpg", "products/p_baladi_rose/g1.jpg", "products/p_baladi_rose/g2.jpg", "products/p_baladi_rose/g3.jpg", "products/p_baladi_rose/g4.jpg"]},
      {id:"p31", cat:"c1", ar:"وردة اقحوان", en:"Clove Rose Candle", descAr:"شمعة على شكل وردة اقحوان — عطر طبيعي دافئ.", descEn:"Clove rose-shaped candle with a warm natural fragrance.", price:26},
      {id:"p33", cat:"c1", ar:"وردة مقفولة", en:"Closed Rose Candle", descAr:"شمعة على شكل وردة مقفولة — عطر زهري هادئ.", descEn:"Closed rose-shaped candle with a calm floral scent.", price:26, imgs:["products/p_baladi_rose/main.jpg", "products/p_baladi_rose/g1.jpg", "products/p_baladi_rose/g2.jpg", "products/p_baladi_rose/g3.jpg", "products/p_baladi_rose/g4.jpg"]}
    ]
  };
}
let DATA = loadData();
let prodPicker=null, editProdPicker=null;

/* ===== Sheet-derived pricing (market & cost) =====
   Source: sheet_data/wanas_calculator.xlsx -> 'final 1125'
     market  = column "بيع"   (competitive / market reference price)
     cost    = column "تشغيل"  (manufacturing / operating cost)
   Discount is shown when the listed price < market.
   Profit (admin) = listed price - cost  (x2 factor dropped per request). */
const PRICING = {
  p30:{cost:27, market:54},
  p31:{cost:13, market:26},
  p33:{cost:13, market:26},
  p2:{cost:31, market:62},
  p3:{cost:39, market:78},
  p4:{cost:40, market:80},
  p5:{cost:46, market:92},
  p6:{cost:59, market:118},
  p7:{cost:66, market:132},
  p8:{cost:59, market:118},
  p9:{cost:94, market:188},
  p10:{cost:94, market:188},
  p11:{cost:115, market:230},
  p12:{cost:150, market:300},
  p13:{cost:98, market:196},
  p14:{cost:220, market:440},
  p15:{cost:311, market:622},
  p16:{cost:13, market:26},
  p17:{cost:27, market:54},
  p18:{cost:46, market:92},
  p19:{cost:130, market:260},
  p20:{cost:46.5, market:93},
  p21:{cost:36, market:72},
  p22:{cost:185, market:370},
  p23:{cost:21, market:42},
  p24:{cost:196, market:392},
  p25:{cost:136, market:272},
  p26:{cost:166, market:332},
  p27:{cost:91, market:182},
  p28:{cost:90, market:120},
  p29:{cost:128.5, market:195}
};
function applyPricing(){
  if(!DATA||!DATA.products) return;
  DATA.products.forEach(p=>{ const m=PRICING[p.id]; if(!m) return;
    if(m.cost!=null) p.cost=m.cost; if(m.market!=null) p.market=m.market; });
}
applyPricing();

let CART = loadCart();
let activeCat = "all";
let selectedPay = null;

/* ====================== Storage ====================== */
function loadData(){
  try{ const d = JSON.parse(localStorage.getItem("wanas_data")); if(d&&d.categories) return d; }catch(e){}
  return defaultData();
}
function saveData(){ localStorage.setItem("wanas_data", JSON.stringify(DATA)); }
function loadCart(){
  try{ const c = JSON.parse(localStorage.getItem("wanas_cart")); if(Array.isArray(c)){ return c.filter(i=>DATA.products.some(p=>p.id===i.id)); } }catch(e){}
  return [];
}
function saveCart(){ localStorage.setItem("wanas_cart", JSON.stringify(CART)); }

/* ====================== Helpers ====================== */
const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);
/* Owner password stored obfuscated (char codes) so it is not a plaintext grep in the source.
   NOTE: a static site cannot truly hide a client-side secret — this only stops casual snooping.
   Real security requires a backend (see README/notes). */
function _adminPW(){ const c=[119,97,110,97,115,49,50,51]; return String.fromCharCode.apply(null,c); }
function t(key){ return (I18N[LANG]&&I18N[LANG][key]) || key; }
function money(n){ return n + (LANG==="ar"?" جنيه":" EGP"); }
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2200); }
function uid(){ return "x"+Math.random().toString(36).slice(2,9); }
function isImg(v){ return typeof v==="string" && (v.startsWith("http")||v.startsWith("data:image")||/\.(jpe?g|png|gif|webp|svg)$/i.test(v)); }
/* Parse a multi-image textarea value into a clean array.
   Entries are separated by newlines OR commas that are NOT part of a data: URL.
   Each entry may itself contain commas (e.g. data:image/png;base64,xxxx) so we must
   not split inside a data: URL. */
function parseImgList(str){
  return String(str||"").split("\n").flatMap(line=>{
    const parts=line.split(",");
    const out=[]; let buf="";
    for(const p of parts){
      if(buf.startsWith("data:") && !buf.includes(",")){ buf+=","+p; }   // rejoin split data URL
      else { if(buf) out.push(buf); buf=p; }
    }
    if(buf) out.push(buf);
    return out;
  }).map(s=>s.trim()).filter(Boolean);
}
/* Backward-compat: migrate legacy single `img` field onto the `imgs` array. */
function migrateProduct(p){
  if(!p) return p;
  if(p.img!==undefined){
    if(!Array.isArray(p.imgs) || !p.imgs.length) p.imgs = p.img ? [p.img] : [];
    delete p.img;
  }
  if(!Array.isArray(p.imgs)) p.imgs=[];
  return p;
}
/* Live thumbnail preview below a multi-image textarea. */
function renderImgPreview(inputEl, previewEl){
  if(!inputEl||!previewEl) return;
  const imgs=parseImgList(inputEl.value);
  if(!imgs.length){ previewEl.innerHTML=`<span class="img-fallback">📦</span>`; return; }
  previewEl.innerHTML=imgs.map(s=>`<div class="img-thumb">${isImg(s)?`<img src="${s}" alt="">`:`<span class="img-fallback" title="${s}">${s}</span>`}</div>`).join("");
}

/* ====================== Multi-image picker (upload + paste) ====================== */
function buildPicker(ids){
  const P=$("#"+ids.picker), F=$("#"+ids.file), B=$("#"+ids.btn), T=$("#"+ids.ta), PV=$("#"+ids.preview);
  let list=parseImgList(T.value);
  const renderPicker=()=>{
    P.innerHTML="";
    list.forEach((src,i)=>{
      const cell=document.createElement("div"); cell.className="ip-thumb";
      cell.innerHTML=(isImg(src)?`<img src="${src}" alt="">`:`<span class="img-fallback" title="${src}">${src}</span>`)+`<button type="button" class="ip-x" aria-label="Remove image">✕</button>`;
      cell.querySelector(".ip-x").onclick=()=>{ list.splice(i,1); commit(); renderPicker(); };
      P.appendChild(cell);
    });
    const add=document.createElement("button"); add.type="button"; add.className="ip-add"; add.textContent="+"; add.setAttribute("aria-label","Add image"); add.onclick=()=>F.click();
    P.appendChild(add);
  };
  const commit=()=>{ T.value=list.join("\n"); renderImgPreview(T,PV); };
  B.onclick=()=>F.click();
  F.onchange=()=>{ const files=F.files; if(!files||!files.length) return; let n=0;
    for(const f of files){ const r=new FileReader(); r.onload=()=>{ list.push(r.result); if(++n===files.length){ commit(); renderPicker(); } }; r.readAsDataURL(f); }
    F.value=""; };
  T.addEventListener("input", ()=>{ list=parseImgList(T.value); renderPicker(); renderImgPreview(T,PV); });
  renderPicker(); renderImgPreview(T,PV);
  return { refresh:()=>{ list=parseImgList(T.value); renderPicker(); renderImgPreview(T,PV); },
           reset:()=>{ list=[]; T.value=""; commit(); renderPicker(); } };
}

/* ====================== Render i18n ====================== */
function applyLang(){
  document.documentElement.lang = LANG;
  document.documentElement.dir = (LANG==="ar")?"rtl":"ltr";
  $("#langBtn").textContent = (LANG==="ar")?"EN":"ع";
  $$("[data-i18n]").forEach(el=>{ const k=el.getAttribute("data-i18n"); if(I18N[LANG]&&I18N[LANG][k]!=null) el.textContent=I18N[LANG][k]; });
  $$("[data-i18n-ph]").forEach(el=>{ const k=el.getAttribute("data-i18n-ph"); if(I18N[LANG]&&I18N[LANG][k]!=null) el.placeholder=I18N[LANG][k]; });
  // refresh hero/footer text from settings
  if(S){
    const h1 = document.getElementById("heroTitleText");
    const sub = document.getElementById("heroSubText");
    const footerTagline = document.getElementById("footerTaglineText");
    if(h1 && S) h1.textContent = (LANG==="ar") ? (S.heroTitleAr||"") : (S.heroTitleEn||"");
    if(sub && S) sub.textContent = (LANG==="ar") ? (S.heroSubAr||"") : (S.heroSubEn||"");
    if(footerTagline && S) footerTagline.textContent = (LANG==="ar") ? (S.footerAr||"") : (S.footerEn||"");
  }
}

/* ====================== Store render ====================== */
function renderCats(){
  const tabs = $("#catTabs"); tabs.innerHTML="";
  const all = document.createElement("div");
  all.className="cat-tab"+(activeCat==="all"?" active":"");
  all.textContent = t("all");
  all.onclick=()=>{activeCat="all";renderCats();renderProducts();};
  tabs.appendChild(all);
  DATA.categories.forEach(c=>{
    const el=document.createElement("div");
    el.className="cat-tab"+(activeCat===c.id?" active":"");
    el.textContent = LANG==="ar"?c.ar:c.en;
    el.onclick=()=>{activeCat=c.id;renderCats();renderProducts();};
    tabs.appendChild(el);
  });
}
function renderProducts(){
  const grid=$("#productGrid"); grid.innerHTML="";
  const list = DATA.products.filter(p=> activeCat==="all" || p.cat===activeCat);
  if(!list.length){ grid.innerHTML=`<div class="empty">${t("empty_store")}</div>`; return; }
  list.forEach(p=>{
    const card=document.createElement("div"); card.className="card";
    const cat = DATA.categories.find(c=>c.id===p.cat);
    const imgs = (p.imgs&&p.imgs.length)?p.imgs:[].filter(Boolean);
    const imgHtml = (imgs[0] && isImg(imgs[0]))?`<img src="${imgs[0]}" alt="${LANG==="ar"?p.ar:p.en}" loading="lazy">`:(imgs[0]||"📦");
    const thumbs = imgs.length>1?`<div class="thumbs">`+imgs.map((s,i)=>`<button class="thumb ${i===0?'active':''}" data-pid="${p.id}" data-idx="${i}" aria-label="${LANG==="ar"?p.ar:p.en} - ${i+1}" role="button"><img src="${s}" alt=""></button>`).join("")+`</div>`:"";
    const market = (() => {
      if(p.market!=null && p.market>0) return p.market;
      if(S.marketPrices && S.marketPrices[p.id] != null) return S.marketPrices[p.id];
      if(PRICING[p.id] && PRICING[p.id].market) return PRICING[p.id].market;
      return null;
    })();
    const disc = (typeof market==="number" && p.price < market) ? Math.round((1 - p.price/market)*100) : 0;
    const priceRow = disc>0
      ? `<div class="price-row"><span class="price old">${money(market)}</span><span class="price">${money(p.price)}</span><span class="discount-badge">-${disc}%</span></div>`
      : `<div class="price-row"><span class="price">${money(p.price)}</span></div>`;
    card.innerHTML=`
      <div class="ph" data-pid="${p.id}">${imgHtml}${imgs.length>1?`<span class="more-badge">+${imgs.length-1}</span>`:""}</div>
      <h3>${LANG==="ar"?p.ar:p.en}</h3>
      <div class="desc">${LANG==="ar"?p.descAr:p.descEn}</div>
      ${priceRow}
      ${thumbs}
      <button class="btn sm add-btn">${t("add")}</button>`;
    const mainEl = card.querySelector(".ph");
    const setMain = (i)=>{ const m=imgs[i]||""; mainEl.innerHTML = ((m && isImg(m))?`<img src="${m}" alt="${LANG==="ar"?p.ar:p.en}" loading="lazy">`:(m||"📦")) + (imgs.length>1?`<span class="more-badge">+${imgs.length-1}</span>`:""); };
    let activeImg = 0;
    card.querySelector(".add-btn").onclick=()=>addToCart(p.id);
    mainEl.onclick=()=>openGallery(p.id, activeImg);
    card.querySelectorAll(".thumb").forEach(b=>{ b.onclick=(e)=>{ e.stopPropagation(); activeImg=Number(b.dataset.idx); setMain(activeImg); card.querySelectorAll(".thumb").forEach(x=>x.classList.remove("active")); b.classList.add("active"); }; });
    grid.appendChild(card);
  });
}

/* ====================== Cart ====================== */
function addToCart(id){
  const ex=CART.find(i=>i.id===id);
  if(ex) ex.qty++; else CART.push({id,qty:1});
  saveCart(); renderCart(); updateCartCount(); toast(t("add"));
}
function changeQty(id,d){
  const it=CART.find(i=>i.id===id); if(!it) return;
  it.qty+=d; if(it.qty<=0) CART=CART.filter(i=>i.id!==id);
  saveCart(); renderCart(); updateCartCount();
}
function removeFromCart(id){ CART=CART.filter(i=>i.id!==id); saveCart(); renderCart(); updateCartCount(); }
function cartTotal(){ return CART.reduce((s,i)=>{ const p=DATA.products.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); }
function updateCartCount(){
  const n=CART.reduce((s,i)=>s+i.qty,0);
  const el=$("#cartCount"); el.textContent=n; el.classList.toggle("hidden", n===0);
}
function renderCart(){
  const box=$("#cartItems"); box.innerHTML="";
  if(!CART.length){ box.innerHTML=`<div class="empty">${t("empty_cart")}</div>`; $("#cartTotal").textContent=money(0); return; }
  CART.forEach(i=>{
    const p=DATA.products.find(x=>x.id===i.id); if(!p) return;
    const imgs=(p.imgs&&p.imgs.length)?p.imgs:[].filter(Boolean);
    const row=document.createElement("div"); row.className="ci";
    const imgHtml=(imgs[0]&&isImg(imgs[0]))?`<img src="${imgs[0]}" alt="${LANG==="ar"?p.ar:p.en}">`:(imgs[0]||"📦");
    row.innerHTML=`
      <div class="ci-ph" data-pid="${p.id}" data-idx="0">${imgHtml}</div>
      <div class="ci-info"><b>${LANG==="ar"?p.ar:p.en}</b>${money(p.price)}</div>
      <div class="qty"><button class="dec">−</button><span>${i.qty}</span><button class="inc">+</button></div>
      <button class="rm">${t("remove")}</button>`;
    row.querySelector(".dec").onclick=()=>changeQty(i.id,-1);
    row.querySelector(".inc").onclick=()=>changeQty(i.id,1);
    row.querySelector(".rm").onclick=()=>removeFromCart(i.id);
    row.querySelector(".ci-ph").onclick=()=>openGallery(p.id,0);
    box.appendChild(row);
  });
  $("#cartTotal").textContent=money(cartTotal());
}
function productImgs(p){ return (p&&p.imgs&&p.imgs.length)?p.imgs:[].filter(Boolean); }
function openGallery(pid, idx){
  const p=DATA.products.find(x=>x.id===pid); if(!p) return;
  const imgs=productImgs(p); if(!imgs.length) return;
  let cur=idx||0;
  const overlay=document.createElement("div"); overlay.className="gallery";
  const render=()=>{
    overlay.innerHTML=`
      <button class="g-close" aria-label="Close gallery">✕</button>
      <button class="g-nav g-prev" aria-label="Previous image">‹</button>
      <img class="g-img" src="${imgs[cur]}" alt="${LANG==="ar"?p.ar:p.en}">
      <button class="g-nav g-next" aria-label="Next image">›</button>
      <div class="g-count">${cur+1} / ${imgs.length}</div>
      ${imgs.length>1?`<div class="g-thumbs">`+imgs.map((s,i)=>`<button class="g-thumb ${i===cur?'active':''}" data-i="${i}"><img src="${s}" alt=""></button>`).join("")+`</div>`:""}`;
    overlay.querySelector(".g-close").onclick=()=>overlay.remove();
    overlay.querySelector(".g-prev").onclick=(e)=>{e.stopPropagation();cur=(cur-1+imgs.length)%imgs.length;render();};
    overlay.querySelector(".g-next").onclick=(e)=>{e.stopPropagation();cur=(cur+1)%imgs.length;render();};
    overlay.querySelectorAll(".g-thumb").forEach(b=>{ b.onclick=(e)=>{e.stopPropagation();cur=Number(b.dataset.i);render();}; });
  };
  overlay.onclick=(e)=>{ if(e.target===overlay) overlay.remove(); };
  document.body.appendChild(overlay); render();
}

/* ====================== Checkout ====================== */
function renderPay(){
  const list=$("#payList"); list.innerHTML="";
  const opts=[
    {k:"vodafone", ic:"📱", name:t("pay_vod"), det:S.vodafone||PAYMENT.vodafone, copy:S.vodafone||PAYMENT.vodafone, copyMsg:(LANG==="ar"?"تم نسخ رقم فودافون كاش ✅":"تم نسخ رقم فودافون كاش ✅")},
    {k:"instapay", ic:"💳", name:t("pay_inst"), det:S.instapay||PAYMENT.instapay, copy:S.instapay||PAYMENT.instapay, copyMsg:(LANG==="ar"?"تم نسخ رقم إنستا باي ✅":"تم نسخ رقم إنستا باي ✅")},
    {k:"bank", ic:"🏦", name:t("pay_bank"), det:(S.bank||PAYMENT.bank).replace(/\\n/g," · "), copy:(S.bank||PAYMENT.bank||"").replace(/.*IBAN:\s*/,""), copyMsg:(LANG==="ar"?"تم نسخ رقم الـ IBAN ✅":"IBAN copied ✅")},
    {k:"whatsapp", ic:"💬", name:t("pay_wa"), det:t("pay_wa_det"), copy:null, copyMsg:null}
  ];
  opts.forEach(o=>{
    const el=document.createElement("div"); el.className="pay"; el.dataset.k=o.k;
    el.innerHTML=`<div class="ic">${o.ic}</div><div class="det"><b>${o.name}</b><span>${o.det}</span></div>`;
    el.onclick=()=>{
      selectedPay=o.k;
      $$("#payList .pay").forEach(x=>x.classList.remove("sel"));
      el.classList.add("sel");
      if(o.copy){ copyToClipboard(o.copy); toast(o.copyMsg); }
    };
    list.appendChild(el);
  });
}
function copyToClipboard(text){
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text);
    } else {
      const ta=document.createElement("textarea"); ta.value=text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
  }catch(e){ /* ignore */ }
}
function buildOrderText(){
  const L = LANG==="ar";
  const lines=[];
  lines.push(L?"*طلب جديد — وَنَس*":"*New Order — Wanas*");
  lines.push("");
  // 1) بيانات العميل
  lines.push(L?"*بيانات العميل:*":"*Customer Details:*");
  lines.push(`• ${L?"الاسم":"Name"}: ${($("#custName").value||"-")}`);
  lines.push(`• ${L?"التليفون":"Phone"}: ${($("#custPhone").value||"-")}`);
  lines.push(`• ${L?"العنوان":"Address"}: ${($("#custAddr").value||"-")}`);
  if($("#custNote").value) lines.push(`• ${L?"ملاحظات":"Notes"}: ${$("#custNote").value}`);
  lines.push("");
  // 2) المنتجات
  lines.push(L?"*المنتجات:*":"*Products:*");
  CART.forEach((i)=>{ const p=DATA.products.find(x=>x.id===i.id); if(!p) return;
    lines.push(`• ${L?p.ar:p.en}`);
    lines.push(`     ${L?"السعر":"Unit"}: ${money(p.price)}  ×  ${L?"الكمية":"Qty"}: ${i.qty}  =  ${L?"الإجمالي":"Total"}: ${money(p.price*i.qty)}`);
  });
  lines.push("");
  lines.push(`${L?"*الإجمالي الكلي:*":"*Grand Total:*"} ${money(cartTotal())}`);
  lines.push("");
  // 3) بيانات الدفع
  const payName = {vodafone:t("pay_vod"),instapay:t("pay_inst"),bank:t("pay_bank"),whatsapp:t("pay_wa")}[selectedPay]||"";
  lines.push(L?"*بيانات الدفع:*":"*Payment Details:*");
  lines.push(`• ${L?"طريقة الدفع":"Payment Method"}: ${payName||"-"}`);
  if(selectedPay==="vodafone") lines.push(`• ${L?"رقم فودافون كاش":"Vodafone Cash number"}: ${S.vodafone}`);
  if(selectedPay==="instapay") lines.push(`• ${L?"إنستا باي":"InstaPay"}: ${S.instapay}`);
  if(selectedPay==="bank") lines.push(`• ${L?"IBAN":"IBAN"}: ${S.bank.replace(/.*IBAN:\\s*/,"")}`);
  if(selectedPay==="whatsapp") lines.push(`• ${L?"سيتم تأكيد الطلب عبر واتساب":"Order will be confirmed via WhatsApp"}`);
  return lines.join("\n");
}
function validateOrder(){
  if(!selectedPay){ toast(t("no_pay")); return false; }
  const name=$("#custName").value.trim(), phone=$("#custPhone").value.trim();
  if(!name || !phone){ toast(t("fill_fields")); return false; }
  if(!/^01\d{9}$/.test(phone)){ toast(LANG==="ar"?"رقم التليفون مش صحيح (11 رقم يبدأ بـ 01)":"Enter a valid phone (11 digits, starts with 01)"); return false; }
  return true;
}
function sendWhatsApp(){
  if(!validateOrder()) return;
  const txt=encodeURIComponent(buildOrderText());
  const digits=S.whatsapp.replace(/[^0-9]/g,"");
  const intl=digits.startsWith("0")?"20"+digits.slice(1):(digits.startsWith("20")?digits:"20"+digits);
  const url=`https://wa.me/${intl}?text=${txt}`;
  window.open(url,"_blank");
  toast(t("order_sent"));
}
function sendEmail(){
  if(!validateOrder()) return;
  const subject=encodeURIComponent("طلب جديد — وَنَس");
  const body=encodeURIComponent(buildOrderText());
  window.location.href=`mailto:${S.email}?subject=${subject}&body=${body}`;
  toast(t("order_sent"));
}

/* ====================== SETTINGS: branding / password / market / payment / comms, + GitHub Publish ====================== */
let S = (function(){
  try{ return JSON.parse(localStorage.getItem("wanas_settings")) || {} }catch(e){ return {} }
})();

const DEFAULT_SETTINGS = {
  logoPath: "logo.png",
  logoIconPath: "logo-icon.png",
  brandAr: "وَنَس",
  brandEn: "Wanas",
  brandFont: "Segoe UI,Tahoma,system-ui,sans-serif",
  brandSize: 1.4,
  brandColor: "#7d5a2e",
  heroTitleAr: "راحة بالك تبدأ من هنا",
  heroTitleEn: "Peace of mind starts here",
  heroFont: "Segoe UI,system-ui,sans-serif",
  heroSize: 2.4,
  heroColor: "#a98452",
  heroSubAr: "منتجات وَنَس — جودة تهدي بالك",
  heroSubEn: "Wanas products — quality that soothes your soul",
  heroSubFont: "Segoe UI,system-ui,sans-serif",
  heroSubSize: 1.1,
  heroSubColor: "#7a7268",
  footerAr: "شُمُوعٌ تَمْنَحُكَ دَفْءَ الشَّمْسِ 🕯️",
  footerEn: "Candles that give you the comfort of the sun 🕯️",
  footerFont: "Segoe UI,system-ui,sans-serif",
  footerSize: 0.85,
  footerColor: "#7a7268",
  catFont: "Segoe UI,Tahoma,system-ui,sans-serif",
  catSize: 0.95,
  catColor: "#7a7268",
  catActiveColor: "#ffffff",
  catActiveBg: "#a98452",
  catBorder: "#ece3d6",
  wrongAttempts: 0,
  whatsapp: "01020306395",
  email: "ahmed.alghoraib@gmail.com",
  vodafone: "01020306395",
  instapay: "01020306395",
  bank: "Bank: NBE\\nIBAN: EG900003041450006160803000150",
  comms: [
    {icon:"📷", ar:"إنستجرام", en:"Instagram", value:"https://instagram.com/wanas.candles", type:"social"},
    {icon:"👍", ar:"فيسبوك", en:"Facebook", value:"https://facebook.com/wanas.candles", type:"social"}
  ]
};

function defaultAdminPW(){ return String.fromCharCode(119,97,110,97,115,49,50,51); }
function pwCodeArray(pw){ return [...pw].map(c=>c.charCodeAt(0)); }
function pwFromCodeArray(arr){ return String.fromCharCode(...arr); }
function storedPWCodes(){ try{ return JSON.parse(localStorage.getItem("wanas_adminPW")); }catch(e){ return null; } }
function currentAdminPW(){
  const codes = storedPWCodes();
  return codes ? pwFromCodeArray(codes) : defaultAdminPW();
}
function saveAdminPWCodes(codes){ localStorage.setItem("wanas_adminPW", JSON.stringify(codes)); }

function loadSettings(){
  const d = JSON.parse(localStorage.getItem("wanas_settings"));
  if(!d) return Object.assign({}, DEFAULT_SETTINGS);
  const merged = Object.assign({}, DEFAULT_SETTINGS, d);
  if(!merged.comms || !Array.isArray(merged.comms)) merged.comms = DEFAULT_SETTINGS.comms.slice();
  return merged;
}
function saveSettings(){ localStorage.setItem("wanas_settings", JSON.stringify(S)); }

function applyBrandStyles(){
  const logoWord = document.querySelector(".brand-word");
  if(!logoWord) return;
  logoWord.style.fontFamily = S.brandFont;
  logoWord.style.fontSize = S.brandSize+"rem";
  logoWord.style.color = S.brandColor;
}
function applyHeroStyles(){
  const h1 = document.querySelector(".hero h1");
  const p = document.querySelector(".hero p");
  if(h1){
    h1.style.fontFamily = S.heroFont;
    h1.style.fontSize = S.heroSize+"rem";
    h1.style.color = S.heroColor;
  }
  if(p){
    p.style.fontFamily = S.heroSubFont;
    p.style.fontSize = S.heroSubSize+"rem";
    p.style.color = S.heroSubColor;
  }
}
function applyFooterStyles(){
  const footer = document.querySelector("footer.foot");
  if(!footer) return;
  footer.style.fontFamily = S.footerFont;
  footer.style.fontSize = S.footerSize+"rem";
  footer.style.color = S.footerColor;
}
function applyCatStyles(){
  document.querySelectorAll(".cat-tab").forEach(el=>{
    el.style.fontFamily = S.catFont;
    el.style.fontSize = S.catSize+"rem";
    el.style.color = S.catColor;
    el.style.background = "var(--card)";
    el.style.border = "1px solid "+S.catBorder;
  });
  document.querySelectorAll(".cat-tab.active").forEach(el=>{
    el.style.color = S.catActiveColor;
    el.style.background = S.catActiveBg;
    el.style.borderColor = S.catActiveBg;
  });
}
function applyAllStyles(){
  applyBrandStyles();
  applyHeroStyles();
  applyFooterStyles();
  applyCatStyles();
  const logoImg = document.querySelector(".logo .logo-img");
  if(logoImg) logoImg.src = S.logoPath;
  const heroLogo = document.querySelector(".hero-logo");
  if(heroLogo) heroLogo.src = S.logoPath;
  const footLogo = document.querySelector(".foot-logo");
  if(footLogo) footLogo.src = S.logoIconPath;
  // brand word text (next to logo) — bilingual from settings
  const bw = document.querySelector(".brand-word");
  if(bw) bw.textContent = (LANG==="ar") ? (S.brandAr||"") : (S.brandEn||"");
}

function pwStrengthInfo(pw){
  if(!pw) return {label:"", cls:""};
  let score = 0;
  if(pw.length>=6) score++;
  if(pw.length>=10) score++;
  if(/[A-Z]/.test(pw)) score++;
  if(/[a-z]/.test(pw)) score++;
  if(/[0-9]/.test(pw)) score++;
  if(/[^A-Za-z0-9]/.test(pw)) score++;
  if(score<=2) return {label:"Weak — use more chars / mix", cls:"bad"};
  if(score<=4) return {label:"Fair", cls:""};
  return {label:"Strong", cls:"ok"};
}
function recordWrongAttempt(){
  S.wrongAttempts = (S.wrongAttempts||0) + 1;
  saveSettings();
  renderWrongAttempts();
}
function renderWrongAttempts(){
  const el = $("#wrongAttemptsDisplay");
  if(!el) return;
  const n = S.wrongAttempts||0;
  el.textContent = n + (n===1?" wrong attempt":" wrong attempts");
}

function showSettingsTab(tab){
  document.querySelectorAll("#settingsTabs button").forEach(b=>{
    b.classList.toggle("active", b.dataset.st === tab);
  });
  document.querySelectorAll(".settings-panel").forEach(p=>{
    p.classList.toggle("active", p.dataset.sp === tab);
  });
}
function renderBrandingForm(){
  $("#cfgLogo").value = S.logoPath;
  $("#cfgLogoSmall").value = S.logoIconPath;
  $("#cfgBrandAr").value = S.brandAr;
  $("#cfgBrandEn").value = S.brandEn;
  $("#cfgBrandFont").value = S.brandFont;
  $("#cfgBrandSize").value = S.brandSize;
  $("#cfgBrandColor").value = S.brandColor;
  $("#cfgHeroTitleAr").value = S.heroTitleAr;
  $("#cfgHeroTitleEn").value = S.heroTitleEn;
  $("#cfgHeroFont").value = S.heroFont;
  $("#cfgHeroSize").value = S.heroSize;
  $("#cfgHeroColor").value = S.heroColor;
  $("#cfgHeroSubAr").value = S.heroSubAr;
  $("#cfgHeroSubEn").value = S.heroSubEn;
  $("#cfgHeroSubFont").value = S.heroSubFont;
  $("#cfgHeroSubSize").value = S.heroSubSize;
  $("#cfgHeroSubColor").value = S.heroSubColor;
  $("#cfgFooterAr").value = S.footerAr;
  $("#cfgFooterEn").value = S.footerEn;
  $("#cfgFooterFont").value = S.footerFont;
  $("#cfgFooterSize").value = S.footerSize;
  $("#cfgFooterColor").value = S.footerColor;
  $("#cfgCatFont").value = S.catFont;
  $("#cfgCatSize").value = S.catSize;
  $("#cfgCatColor").value = S.catColor;
  $("#cfgCatColorActive").value = S.catActiveColor;
  $("#cfgCatBgActive").value = S.catActiveBg;
  $("#cfgCatBorder").value = S.catBorder;
  renderBrandPreview();
  applyAllStyles();
}
function renderBrandPreview(){
  const ar = S.brandAr || "وَنَس";
  const en = S.brandEn || "Wanas";
  const previewAr = $("#bpBrandTextAr");
  const previewEn = $("#bpBrandTextEn");
  const previewLabel = $("#bpBrandLabel");
  if(previewLabel) previewLabel.textContent = (LANG==="ar") ? ar : en;
  if(previewAr){ previewAr.textContent = ar; previewAr.style.display = (LANG==="ar")?"":"none"; }
  if(previewEn){ previewEn.textContent = en; previewEn.style.display = (LANG==="ar")?"none":""; }
  const logoPreview = $("#bpLogo");
  if(logoPreview) logoPreview.src = S.logoPath || "logo.png";
}
function saveBranding(){
  S.logoPath = $("#cfgLogo").value.trim() || "logo.png";
  S.logoIconPath = $("#cfgLogoSmall").value.trim() || "logo-icon.png";
  S.brandAr = $("#cfgBrandAr").value.trim() || "وَنَس";
  S.brandEn = $("#cfgBrandEn").value.trim() || "Wanas";
  S.brandFont = $("#cfgBrandFont").value || "Segoe UI,Tahoma,system-ui,sans-serif";
  S.brandSize = parseFloat($("#cfgBrandSize").value) || 1.4;
  S.brandColor = $("#cfgBrandColor").value || "#7d5a2e";
  S.heroTitleAr = $("#cfgHeroTitleAr").value.trim() || "راحة بالك تبدأ من هنا";
  S.heroTitleEn = $("#cfgHeroTitleEn").value.trim() || "Peace of mind starts here";
  S.heroFont = $("#cfgHeroFont").value || "Segoe UI,system-ui,sans-serif";
  S.heroSize = parseFloat($("#cfgHeroSize").value) || 2.4;
  S.heroColor = $("#cfgHeroColor").value || "#a98452";
  S.heroSubAr = $("#cfgHeroSubAr").value.trim() || "منتجات وَنَس — جودة تهدي بالك";
  S.heroSubEn = $("#cfgHeroSubEn").value.trim() || "Wanas products — quality that soothes your soul";
  S.heroSubFont = $("#cfgHeroSubFont").value || "Segoe UI,system-ui,sans-serif";
  S.heroSubSize = parseFloat($("#cfgHeroSubSize").value) || 1.1;
  S.heroSubColor = $("#cfgHeroSubColor").value || "#7a7268";
  S.footerAr = $("#cfgFooterAr").value.trim() || "شُمُوعٌ تَمْنَحُكَ دَفْءَ الشَّمْسِ 🕯️";
  S.footerEn = $("#cfgFooterEn").value.trim() || "Candles that give you the comfort of the sun 🕯️";
  S.footerFont = $("#cfgFooterFont").value || "Segoe UI,system-ui,sans-serif";
  S.footerSize = parseFloat($("#cfgFooterSize").value) || 0.85;
  S.footerColor = $("#cfgFooterColor").value || "#7a7268";
  S.catFont = $("#cfgCatFont").value || "Segoe UI,Tahoma,system-ui,sans-serif";
  S.catSize = parseFloat($("#cfgCatSize").value) || 0.95;
  S.catColor = $("#cfgCatColor").value || "#7a7268";
  S.catActiveColor = $("#cfgCatColorActive").value || "#ffffff";
  S.catActiveBg = $("#cfgCatBgActive").value || "#a98452";
  S.catBorder = $("#cfgCatBorder").value || "#ece3d6";
  saveSettings();
  applyAllStyles();
  renderBrandPreview();
  applyLang();
  renderCats();
  renderProducts();
  toast("Saved ✓");
}
function savePassword(){
  const cur = $("#cfgCurPass").value;
  const np = $("#cfgNewPass").value;
  const cp = $("#cfgConfirmPass").value;
  if(cur!==currentAdminPW()){ toast(t("wrong_pwd")); return; }
  if(np!==cp){ toast(t("wrong_pwd")); return; }
  if(np.length<4){ toast(t("weak")); return; }
  saveAdminPWCodes(pwCodeArray(np));
  S.password = np;
  saveSettings();
  toast(t("password_changed"));
  $("#cfgCurPass").value = "";
  $("#cfgNewPass").value = "";
  $("#cfgConfirmPass").value = "";
  $("#pwStrength").textContent = "";
  $("#pwStrength").className = "pw-strength";
}
function applyPaymentSettings(){
  PAYMENT.vodafone = S.vodafone || PAYMENT.vodafone;
  PAYMENT.instapay = S.instapay || PAYMENT.instapay;
  PAYMENT.bank = S.bank || PAYMENT.bank;
  PAYMENT.whatsapp = S.whatsapp || PAYMENT.whatsapp;
  PAYMENT.email = S.email || PAYMENT.email;
}
function savePayment(){
  S.vodafone = $("#cfgVodafone").value.trim() || PAYMENT.vodafone;
  S.instapay = $("#cfgInstapay").value.trim() || PAYMENT.instapay;
  S.bank = $("#cfgBank").value || PAYMENT.bank;
  S.whatsapp = $("#cfgWhatsapp").value.trim() || PAYMENT.whatsapp;
  S.email = $("#cfgEmail").value.trim() || PAYMENT.email;
  saveSettings();
  applyPaymentSettings();
  renderPay();
  toast(t("login_ok"));
}
function resetWrongAttempts(){
  S.wrongAttempts = 0;
  saveSettings();
  renderWrongAttempts();
  toast("Reset ✓");
}
/* ====================== GitHub publish ====================== */
const GH_KEY = "wanas_gh";
function ghLoad(){ try{ return JSON.parse(localStorage.getItem(GH_KEY))||{} }catch(e){ return {} } }
function ghSave(v){ localStorage.setItem(GH_KEY, JSON.stringify(v)); }
function ghOwner(){ return "seddiqrahma-pixel"; }
function ghRepo(){ return "wanas"; }
function ghToken(){ const g=ghLoad(); return g.token || ""; }
function renderGitHubForm(){
  $("#ghToken").value = ghToken();
  $("#ghStatus").textContent = "";
  $("#ghPublishBtn").textContent = t("gh_btn");
}
function saveGitHub(){
  const token = $("#ghToken").value.trim();
  if(!token){ toast(t("gh_need")); return; }
  ghSave({token});
  toast(t("login_ok"));
}
function clearGitHub(){
  ghSave({});
  renderGitHubForm();
  toast("Cleared");
}
function publishToGitHub(){
  const owner = ghOwner(), repo = ghRepo(), token = ghToken();
  if(!token){ toast(t("gh_need")); return; }
  const st = $("#ghStatus");
  st.textContent = t("gh_status");
  $("#ghPublishBtn").disabled = true;
  function pubCfg(){ const s=Object.assign({},S); delete s.password; delete s.wrongAttempts; return s; }
  const payload = JSON.stringify({
    categories: DATA.categories,
    products: DATA.products,
    settings: (()=>{ const s=Object.assign({},S); delete s.password; delete s.wrongAttempts; return s; })()
  }, null, 2);
  const encoded = btoa(unescape(encodeURIComponent(payload)));
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/data.json`;
  fetch(url, {
    method:"PUT",
    headers:{
      "Authorization":"Bearer "+token,
      "Accept":"application/vnd.github+json",
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      message:"Wanas update (admin panel)",
      content: encoded,
      branch:"main"
    })
  })
  .then(r=>{
    if(!r.ok){
      return r.json().then(j=>{ throw new Error((j&&j.message)||r.status+" "+r.statusText); });
    }
    return r.json();
  })
  .then(()=>{
    st.textContent = t("gh_ok");
    $("#ghPublishBtn").disabled = false;
    toast(t("login_ok"));
  })
  .catch(err=>{
    st.textContent = t("gh_err")+" — "+(err.message||"");
    $("#ghPublishBtn").disabled = false;
    toast(t("gh_err"));
  });
}
function fetchLiveData(){
  const owner = ghOwner(), repo = ghRepo(), token = ghToken();
  if(!owner || !repo){ return null; }
  return fetch(`https://api.github.com/repos/${owner}/${repo}/contents/data.json`, {
    headers:{"Accept":"application/vnd.github+json"}
  })
  .then(r=> r.ok ? r.json() : Promise.reject())
  .then(j=>{ if(!j || !j.content) return null; return decodeURIComponent(escape(atob(j.content))); })
  .then(json=>{ try{ const d=JSON.parse(json); if(d&&d.categories&&d.products) return d; }catch(e){} return null; })
  .catch(()=>null);
}
function applyLangText(){
  applyBrandStyles();
  applyHeroStyles();
  applyFooterStyles();
  applyCatStyles();
  applyAllStyles();
  renderBrandPreview();
  renderFooterComms();
}
function renderMarketList(){
  const box = $("#marketList");
  if(!box) return;
  box.innerHTML = "";
  if(!DATA || !DATA.products.length){ box.innerHTML = `<div class="empty">${t("empty_store")}</div>`; return; }
  DATA.products.forEach(p=>{
    const stored = (S.marketPrices && S.marketPrices[p.id]);
    const market = (typeof stored==="number") ? stored : (PRICING[p.id] && PRICING[p.id].market ? PRICING[p.id].market : null);
    const cost = (PRICING[p.id] && PRICING[p.id].cost);
    const row = document.createElement("div");
    row.className = "market-row";
    const disc = (typeof market==="number" && p.price < market) ? Math.round((1 - p.price/market)*100) : 0;
    row.innerHTML = `
      <div class="mr-info">
        <b>${LANG==="ar"?p.ar:p.en}</b>
        <span>${catLabel(p.cat)} — ${money(p.price)}</span>
        ${disc>0?` <span class="discount-badge">-${disc}%</span>`:""}
      </div>
      <label>${t("market_price")}:</label>
      <input type="number" class="mr-market" data-id="${p.id}" value="${market!=null?market:""}" placeholder="0">
    `;
    box.appendChild(row);
    row.querySelector(".mr-market").addEventListener("change", function(){
      const id = this.dataset.id;
      const v = parseFloat(this.value);
      if(!isNaN(v) && v>0){ if(!S.marketPrices) S.marketPrices = {}; S.marketPrices[id] = v; }
      else { if(S.marketPrices) delete S.marketPrices[id]; }
      saveSettings();
      renderMarketList();
      renderProducts();
    });
  });
}
function catLabel(catId){
  if(!catId) return "";
  const c = DATA.categories.find(x=>x.id===catId);
  return c ? (LANG==="ar" ? c.ar : c.en) : catId;
}

function renderCommList(){
  const box = $("#commList");
  if(!box) return;
  box.innerHTML = "";
  const cm = S.comms || DEFAULT_SETTINGS.comms || [];
  if(!cm || !cm.length){ box.innerHTML = `<div class="empty">${t("empty_store")}</div>`; return; }
  cm.forEach((c,i)=>{
    const row = document.createElement("div");
    row.className = "contact-item";
    row.innerHTML = `
      <div class="ci-icon">${c.icon||"📷"}</div>
      <div class="ci-info"><b>${LANG==="ar"?c.ar:c.en}</b><span>${c.value||""}</span></div>
      <button class="btn ghost sm" data-edit-comm="${i}">${t("edit")}</button>
      <button class="btn danger sm" data-del-comm="${i}">${t("delete")}</button>
    `;
    box.appendChild(row);
    row.querySelector("[data-edit-comm]").onclick = ()=>editComm(i);
    row.querySelector("[data-del-comm]").onclick = ()=>{
      S.comms.splice(i,1);
      saveSettings();
      renderCommList();
      renderFooterComms();
      toast("Removed");
    };
  });
}
let editCommIdx = null;
function editComm(i){
  const c = S.comms[i]; if(!c) return;
  editCommIdx = i;
  $("#cfgCommIcon").value = c.icon||"📷";
  $("#cfgCommAr").value = c.ar||"";
  $("#cfgCommEn").value = c.en||"";
  $("#cfgCommValue").value = c.value||"";
  $("#cfgCommType").value = c.type||"social";
  $("#addCommBtn").textContent = "Edit";
}
function addOrUpdateComm(){
  const icon = $("#cfgCommIcon").value.trim() || "📷";
  const ar = $("#cfgCommAr").value.trim();
  const en = $("#cfgCommEn").value.trim();
  const value = $("#cfgCommValue").value.trim();
  const type = $("#cfgCommType").value;
  if(!ar || !en){ toast(t("fill_fields")); return; }
  const entry = {icon, ar, en, value, type};
  if(editCommIdx!=null){ S.comms[editCommIdx] = entry; editCommIdx = null; $("#addCommBtn").textContent = t("add"); }
  else S.comms.push(entry);
  saveSettings();
  renderCommList();
  renderFooterComms();
  toast(t("login_ok"));
}
function renderFooterComms(){
  const container = document.getElementById("footerCommsContainer");
  if(!container) return;
  container.innerHTML = "";
  const comms = S.comms && S.comms.length ? S.comms : (DEFAULT_SETTINGS && DEFAULT_SETTINGS.comms ? DEFAULT_SETTINGS.comms : []);
  comms.forEach(c=>{
    const val = c.value || "";
    const isLink = (c.type==="social" || c.type==="contact") && val && val.charAt(0)==="h";
    let el;
    if(c.type==="contact" && !isLink){
      const digits = String(val).replace(/[^0-9]/g,"");
      const intl = digits.charAt(0)==="0" ? "20"+digits.slice(1) : (digits.indexOf("20")===0 ? digits : "20"+digits);
      el = `<a href="https://wa.me/${intl}" target="_blank" rel="noopener" class="wanas-comm" style="font-weight:700;color:var(--brand2);display:inline-flex;align-items:center;background:rgba(122,72,42,0.08);padding:6px 14px;border-radius:999px"><span style="font-size:1.2rem;margin-right:6px">${c.icon||"📷"}</span>${LANG==="ar"?c.ar:c.en}</a>`;
    } else if(isLink){
      el = `<a href="${val}" target="_blank" rel="noopener" class="wanas-comm" style="font-weight:700;color:var(--brand2);display:inline-flex;align-items:center;background:rgba(122,72,42,0.08);padding:6px 14px;border-radius:999px"><span style="font-size:1.2rem;margin-right:6px">${c.icon||"📷"}</span>${LANG==="ar"?c.ar:c.en}</a>`;
    } else {
      el = `<span class="wanas-comm" style="font-weight:700;color:var(--brand2);display:inline-flex;align-items:center;background:rgba(122,72,42,0.08);padding:6px 14px;border-radius:999px"><span style="font-size:1.2rem;margin-right:6px">${c.icon||"📷"}</span>${LANG==="ar"?c.ar:c.en}</span>`;
    }
    if(el) container.innerHTML += el;
  });
}

/* ====================== Admin ====================== */
let adminUnlocked=false;
function toggleAdmin(){
  if(adminUnlocked){ $("#adminPanel").classList.add("hidden"); adminUnlocked=false; return; }
  $("#adminPass").value=""; $("#adminLoginErr").style.display="none";
  $("#adminLoginModal").classList.add("show"); $("#adminPass").focus();
}
function tryAdminLogin(){
  const pw=$("#adminPass").value;
  if(pw===currentAdminPW()){ adminUnlocked=true; $("#adminLoginModal").classList.remove("show"); $("#adminPanel").classList.remove("hidden"); toast(t("login_ok")); renderAdmin(); }
  else { $("#adminLoginErr").style.display="block"; recordWrongAttempt(); }
}
function renderAdmin(){
  // categories
  const cl=$("#catList"); cl.innerHTML="";
  DATA.categories.forEach(c=>{
    const row=document.createElement("div"); row.className="list-item";
    row.innerHTML=`<span class="nm">${c.ar} / ${c.en}</span>
      <button class="btn ghost sm ed-cat">${t("edit")}</button>
      <button class="btn danger sm del-cat">${t("delete")}</button>`;
    row.querySelector(".del-cat").onclick=()=>{ DATA.categories=DATA.categories.filter(x=>x.id!==c.id); DATA.products=DATA.products.filter(p=>p.cat!==c.id); saveData(); renderAdmin(); renderCats(); renderProducts(); };
    row.querySelector(".ed-cat").onclick=()=>openEditCat(c.id);
    cl.appendChild(row);
  });
  // render settings panels inside admin
  renderWrongAttempts();
  renderMarketList();
  renderCommList();
  // product cat select
  const pc=$("#prodCat"); pc.innerHTML="";
  DATA.categories.forEach(c=>{ const o=document.createElement("option"); o.value=c.id; o.textContent=c.ar+" / "+c.en; pc.appendChild(o); });
  // products
  const pl=$("#prodList"); pl.innerHTML="";
  DATA.products.forEach(p=>{
    const cat=DATA.categories.find(c=>c.id===p.cat);
    const row=document.createElement("div"); row.className="list-item";
    const cost=(typeof p.cost==="number")?p.cost:null;
    const market=(typeof p.market==="number")?p.market:null;
    const profit=(cost!=null)?(p.price-cost):null;
    const profTxt=(cost!=null)?` • ${LANG==="ar"?"تكلفة":"Cost"}: ${money(cost)} • ${LANG==="ar"?"سوق":"Market"}: ${(market!=null)?money(market):"—"} • ${LANG==="ar"?"ربح":"Profit"}: ${money(profit)}`:"";
    row.innerHTML=`<span class="nm">${p.ar} / ${p.en} — ${money(p.price)} ${cat?("("+(LANG==="ar"?cat.ar:cat.en)+")"):""}${profTxt}</span>
      <button class="btn ghost sm ed-prod">${t("edit")}</button>
      <button class="btn danger sm del-prod">${t("delete")}</button>`;
    row.querySelector(".del-prod").onclick=()=>{ DATA.products=DATA.products.filter(x=>x.id!==p.id); saveData(); renderAdmin(); renderProducts(); };
    row.querySelector(".ed-prod").onclick=()=>openEditProd(p.id);
    pl.appendChild(row);
  });
}
function openEditCat(id){
  const c=DATA.categories.find(x=>x.id===id); if(!c) return;
  $("#editCatId").value=c.id; $("#editCatAr").value=c.ar; $("#editCatEn").value=c.en;
  $("#editCatModal").classList.add("show");
}
function saveEditCat(){
  const id=$("#editCatId").value, ar=$("#editCatAr").value.trim(), en=$("#editCatEn").value.trim();
  if(!ar||!en){ toast(t("fill_fields")); return; }
  const c=DATA.categories.find(x=>x.id===id); if(c){ c.ar=ar; c.en=en; }
  saveData(); $("#editCatModal").classList.remove("show"); renderAdmin(); renderCats(); renderProducts();
}
function openEditProd(id){
    const p=DATA.products.find(x=>x.id===id); if(!p) return;
  migrateProduct(p); $("#editProdId").value=p.id;
  $("#editProdAr").value=p.ar; $("#editProdEn").value=p.en;
  $("#editProdDescAr").value=p.descAr; $("#editProdDescEn").value=p.descEn;
  $("#editProdPrice").value=p.price;
  $("#editProdMarket").value=(typeof p.market==="number"&&p.market>0)?p.market:"";
  $("#editProdImgs").value=(p.imgs&&p.imgs.length)?p.imgs.join(", "):"";
  renderImgPreview($("#editProdImgs"),$("#editProdPreview"));
  if(editProdPicker) editProdPicker.refresh();
  $("#editProdModal").classList.add("show");
}
function saveEditProd(){
  const id=$("#editProdId").value;
  const ar=$("#editProdAr").value.trim(), en=$("#editProdEn").value.trim();
  const descAr=$("#editProdDescAr").value.trim(), descEn=$("#editProdDescEn").value.trim();
  const price=Number($("#editProdPrice").value)||0;
  const market = ($("#editProdMarket").value!=="" && !isNaN(Number($("#editProdMarket").value))) ? Number($("#editProdMarket").value) : undefined;
  const imgs=parseImgList($("#editProdImgs").value);
  const finalImgs=imgs.length?imgs:["📦"];
  if(!ar||!en){ toast(t("fill_fields")); return; }
  const p=DATA.products.find(x=>x.id===id); if(p){ migrateProduct(p); delete p.img; Object.assign(p,{ar,en,descAr,descEn,price,market,imgs:finalImgs}); }
  saveData(); $("#editProdModal").classList.remove("show"); renderAdmin(); renderProducts();
}
function addCategory(){
  const ar=$("#newCatAr").value.trim(), en=$("#newCatEn").value.trim();
  if(!ar||!en){ toast(t("fill_fields")); return; }
  DATA.categories.push({id:uid(),ar,en}); saveData();
  $("#newCatAr").value=""; $("#newCatEn").value=""; renderAdmin(); renderCats();
}
function addProduct(){
  const cat=$("#prodCat").value; if(!cat){ toast(t("fill_fields")); return; }
  const ar=$("#prodAr").value.trim(), en=$("#prodEn").value.trim();
  const descAr=$("#prodDescAr").value.trim(), descEn=$("#prodDescEn").value.trim();
  const price=Number($("#prodPrice").value)||0;
  const market = ($("#prodMarket").value!=="" && !isNaN(Number($("#prodMarket").value))) ? Number($("#prodMarket").value) : undefined;
  const imgs=parseImgList($("#prodImgs").value);
  const finalImgs=imgs.length?imgs:["📦"];
  if(!ar||!en){ toast(t("fill_fields")); return; }
  DATA.products.push({id:uid(),cat,ar,en,descAr,descEn,price,market,imgs:finalImgs}); saveData();
  ["prodAr","prodEn","prodDescAr","prodDescEn","prodPrice","prodMarket"].forEach(id=>$("#"+id).value="");
  if(prodPicker) prodPicker.reset();
  renderAdmin(); renderProducts();
}

/* ====================== Events ====================== */
function bind(){
  $("#langBtn").onclick=()=>{ LANG = LANG==="ar"?"en":"ar"; localStorage.setItem("wanas_lang",LANG); applyLang(); renderCats(); renderProducts(); renderCart(); if(adminUnlocked) renderAdmin(); };
  $("#cartBtn").onclick=()=>openDrawer(true);
  $("#closeCart").onclick=()=>openDrawer(false);
  $("#overlay").onclick=()=>{ openDrawer(false); closeModal(); };
  $("#checkoutBtn").onclick=()=>{ if(!CART.length){toast(t("empty_cart"));return;} renderPay(); renderOrderSummary(); openModal(); };
  $("#closeCheckout").onclick=()=>closeModal();
  $("#sendOrderBtn").onclick=sendWhatsApp;
  $("#sendMailBtn").onclick=sendEmail;
  $("#adminBtn").onclick=toggleAdmin;
  $("#addCatBtn").onclick=addCategory;
  $("#addProdBtn").onclick=addProduct;
  $("#adminLoginBtn").onclick=tryAdminLogin;
  // Owner-only admin access (button is hidden from buyers)
  document.addEventListener("keydown", e=>{ if(e.ctrlKey && e.shiftKey && (e.key==="A"||e.key==="a")){ e.preventDefault(); toggleAdmin(); } });
  let _logoClicks=0, _logoLast=0;
  const _logo=document.querySelector(".logo");
  if(_logo){ _logo.addEventListener("click", e=>{ e.preventDefault(); const now=Date.now(); _logoClicks=(now-_logoLast<400)?_logoClicks+1:1; _logoLast=now; if(_logoClicks>=3){ _logoClicks=0; toggleAdmin(); } }); }
  $("#adminLoginClose").onclick=()=>{ $("#adminLoginModal").classList.remove("show"); };
  $("#adminPass").addEventListener("keydown",e=>{ if(e.key==="Enter") tryAdminLogin(); });
  $("#editCatSave").onclick=saveEditCat;
  $("#editCatClose").onclick=()=>{ $("#editCatModal").classList.remove("show"); };
  $("#editProdSave").onclick=saveEditProd;
  $("#editProdClose").onclick=()=>{ $("#editProdModal").classList.remove("show"); };
  prodPicker=buildPicker({picker:"prodPicker",file:"prodFile",btn:"prodUploadBtn",ta:"prodImgs",preview:"prodPreview"});
  editProdPicker=buildPicker({picker:"editProdPicker",file:"editProdFile",btn:"editProdUploadBtn",ta:"editProdImgs",preview:"editProdPreview"});

  // === settings ===
  document.querySelectorAll("#settingsTabs button").forEach(b=>b.onclick=()=>showSettingsTab(b.dataset.st));
  $("#saveBrandingBtn").onclick=saveBranding;
  $("#savePassBtn").onclick=savePassword;
  $("#savePaymentBtn").onclick=savePayment;
  $("#resetAttemptsBtn").onclick=resetWrongAttempts;
  $("#addCommBtn").onclick=addOrUpdateComm;
  $("#cfgNewPass").addEventListener("input", e=>{
    const info=pwStrengthInfo(e.target.value);
    $("#pwStrength").textContent=info.label;
    $("#pwStrength").className="pw-strength"+(info.cls?" "+info.cls:"");
  });
  renderGitHubForm();
  renderFooterComms();

  $("#resetBtn").onclick=()=>{ if(confirm(t("confirm_reset"))){ DATA=defaultData(); applyPricing(); saveData(); renderCats(); renderProducts(); renderAdmin(); toast("OK"); } };
  $("#exportBtn").onclick=()=>{ const b=new Blob([JSON.stringify(DATA,null,2)],{type:"application/json"}); const a=document.createElement("a"); a.href=URL.createObjectURL(b); a.download="wanas-products.json"; a.click(); URL.revokeObjectURL(a.href); toast("OK"); };
  $("#importBtn").onclick=()=>$("#importFile").click();
  $("#saveBrandingBtn").onclick=saveBranding;
  $("#ghSaveBtn").onclick=saveGitHub;
  $("#ghClearBtn").onclick=clearGitHub;
  $("#ghPublishBtn").onclick=()=>publishToGitHub().catch(e=>{ toast(t("gh_err")); console.error(e); });
  $("#catTabsStyleBtn").onclick=()=>{ showSettingsPanel("cat_tabs_style"); renderCatStyleEditor(); };
  $("#importFile").onchange=(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const d=JSON.parse(r.result); if(!d.categories||!d.products) throw new Error("bad"); DATA=d; applyPricing(); saveData(); renderCats(); renderProducts(); renderAdmin(); toast("OK"); }catch(err){ alert("ملف غير صالح"); } }; r.readAsText(f); e.target.value=""; };
  bindEasyClose();
}
/* Close modals/drawer without hunting for the X:
   - click/tap the dim area outside the white box
   - press ESC
   - phone: swipe in from either screen edge (back gesture) */
function closeAllOverlays(){
  closeModal();
  $("#adminLoginModal").classList.remove("show");
  $("#editProdModal").classList.remove("show");
  $("#editCatModal").classList.remove("show");
  openDrawer(false);
  const g=document.querySelector(".gallery"); if(g) g.remove();
}
function bindEasyClose(){
  // tap the dim backdrop (the .modal itself, not its inner .box) to close
  $$(".modal").forEach(m=>{
    m.addEventListener("click", e=>{ if(e.target===m) m.classList.remove("show"); });
  });
  // ESC closes whatever is open
  document.addEventListener("keydown", e=>{
    if(e.key==="Escape") closeAllOverlays();
  });
  // phone: start a touch within ~32px of either edge, swipe inward >60px
  let edgeX=null, startY=0;
  document.addEventListener("touchstart", e=>{
    if(!e.touches.length){ edgeX=null; return; }
    const x=e.touches[0].clientX;
    edgeX = (x < 32 || x > window.innerWidth-32) ? x : null;
    startY = e.touches[0].clientY;
  }, {passive:true});
  document.addEventListener("touchend", e=>{
    if(edgeX===null || !e.changedTouches.length){ edgeX=null; return; }
    const t=e.changedTouches[0];
    const dx=t.clientX-edgeX, dy=Math.abs(t.clientY-startY);
    if(Math.abs(dx)>60 && Math.abs(dx)>dy) closeAllOverlays();
    edgeX=null;
  }, {passive:true});
}
function openDrawer(o){ $("#cartDrawer").classList.toggle("open",o); $("#overlay").classList.toggle("show",o); }
function openModal(){ $("#checkoutModal").classList.add("show"); }
function closeModal(){ $("#checkoutModal").classList.remove("show"); }
function renderOrderSummary(){
  const box=$("#orderSummary"); box.innerHTML="";
  CART.forEach(i=>{ const p=DATA.products.find(x=>x.id===i.id); if(!p) return;
    const d=document.createElement("div"); d.className="ci"; d.style.border="none";
    const cur=(p.imgs&&p.imgs[0])?p.imgs[0]:(p.img||""); const imgHtml=(cur&&isImg(cur))?`<img src="${cur}" alt="">`:(cur||"📦");
    d.innerHTML=`<div class="ci-ph">${imgHtml}</div><div class="ci-info"><b>${LANG==="ar"?p.ar:p.en}</b>×${i.qty} = ${money(p.price*i.qty)}</div>`;
    box.appendChild(d);
  });
  const tot=document.createElement("div"); tot.className="ci-total";
  tot.style.cssText="display:flex;justify-content:space-between;font-weight:800;margin-top:10px;border-top:1px solid var(--line);padding-top:8px";
  tot.innerHTML=`<span>${LANG==="ar"?"الإجمالي الكلي":"Grand Total"}</span><span>${money(cartTotal())}</span>`;
  box.appendChild(tot);
}

/* ====================== Init ====================== */
function init(){
  S = loadSettings();
  $("#year").textContent=new Date().getFullYear();
  if(DATA&&DATA.products) DATA.products.forEach(migrateProduct);
  applyPaymentSettings();
  // hydrate from published data.json if credentials stored
  fetchLiveData()
    .then(d=>{ if(d){ try{ DATA=d; applyPricing(); saveData(); }catch(e){} } })
    .then(()=>{ applyLang(); renderCats(); renderProducts(); renderCart(); updateCartCount(); bind(); })
    .catch(()=>{ bind(); });
}
init();
