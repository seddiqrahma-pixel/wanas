const fs=require('fs');
const s=fs.readFileSync('/Users/ahmed.alghoraib/Desktop/Wanas/index.html','utf8');

// 1. Get keys ACTUALLY USED in the HTML via data-i18n / data-i18n-ph
const used=new Set();
for(const mm of s.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)) used.add(mm[1]);

// 2. Extract I18N maps by evaluating JS only on the I18N literal
const m=s.match(/const I18N = (\{[\s\S]*?\n\});\n/);
if(!m){console.error('I18N block not found'); process.exit(2);}
const I18N=eval('('+m[1]+')');

console.log('used keys (data-i18n/-ph):',used.size);
const missing={ar:[],en:[]};
for(const k of used){
  for(const lang of ['ar','en']){
    const v = I18N[lang] ? I18N[lang][k] : null;
    if(v==null) missing[lang].push(k);
  }
}
console.log('MISSING in ar:[',missing.ar.join(', '),']');
console.log('MISSING in en:[',missing.en.join(', '),']');

// 3. Site footer (anchored by class="foot", NOT the drawer footer)
const footM=s.match(/<footer class="foot">[\s\S]*?<\/footer>/);
if(!footM){console.error('footer.foot not found'); process.exit(2);}
const foot=footM[0];
const footKeys=[...foot.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g)].map(x=>x[1]);
console.log('--- footer.foot data-i18n keys:',footKeys);
for(const k of footKeys){
  for(const lang of ['ar','en']){
    const v=(I18N[lang]||{})[k];
    console.log(`  footer.foot ${lang}.${k} = ${v==null?'** MISSING **':'"'+String(v).slice(0,40)+'"'}`);
  }
}

// 4. brand key across maps
console.log('--- brand key:');
console.log('  ar.brand =', JSON.stringify(I18N.ar?I18N.ar.brand:null));
console.log('  en.brand =', JSON.stringify(I18N.en?I18N.en.brand:null));

// 5. settings S fields (brandAr/brandEn) used to override the brand word
const dM=s.match(/const DEFAULT_SETTINGS = (\{[\s\S]*?\n\});/);
const D=eval('('+dM[1]+')');
console.log('--- DEFAULT_SETTINGS.brandAr =', JSON.stringify(D.brandAr), '| brandEn =', JSON.stringify(D.brandEn));

// 6. null/undefined values anywhere in the I18N maps (values can be empty string but not missing)
for(const lang of ['ar','en']){
  const bad=Object.keys(I18N[lang]||{}).filter(k=>I18N[lang][k]==null);
  if(bad.length) console.log('I18N.'+lang+' null-valued keys:',bad.join(', '));
}
