// test-admin-features.js — browser-side admin feature test
// Run via: browser_exec navigates to page, then injects this script
(function(){
  const R = {};
  
  function check(label, expr) {
    try { R[label] = expr(); }
    catch(e) { R[label] = 'ERROR: ' + e.message; }
  }
  
  function logResults() {
    console.log('=== TEST RESULTS ===');
    for (const [k,v] of Object.entries(R)) console.log(k + ': ' + JSON.stringify(v));
  }
  
  function summary() {
    const checks = {
      'F1_password_change': R.pwToast && R.pwToast.includes('تم الدخول'),
      'F2_branding_words': R.heroUpdated !== R.heroArOrig && R.footUpdated !== R.footArOrig,
      'F3_font_size_color': R.brandFontApplied && R.brandFontApplied.includes('Arial') && R.heroFontApplied && R.heroFontApplied.includes('Georgia'),
      'F4_bilingual': R.brandArOrig.length > 0 && R.brandEnOrig.length > 0,
      'F5_logo_word': R.brandWordText !== 'NOT_FOUND',
      'F6_categories_add_edit': R.catAfterAdd > R.catListCount,
      'F7_wrong_attempts': R.attemptsDisplay && R.attemptsDisplay.includes('wrong'),
      'F8_market_discount': R.ptestDiscount && R.ptestDiscount !== 'no_badge' && R.ptestDiscount !== 'not_found',
      'F9_payment_info': R.vodafoneAfter === '0123456789',
      'F10_comms_add_remove': R.commAfterDel < R.commAfterAdd,
      'F11_github_panel': R.ghPanelExists && R.ghBtnText && R.ghWarning,
    };
    console.log('=== SUMMARY ===');
    let allPass = true;
    for (const [f,p] of Object.entries(checks)) {
      console.log((p ? 'PASS' : 'FAIL') + ': ' + f);
      if (!p) allPass = false;
    }
    console.log('\n=== OVERALL: ' + (allPass ? 'ALL PASS' : 'SOME FAILED') + ' ===');
  }
  
  // === SETUP ===
  check('products', () => document.querySelectorAll('#productGrid .card').length);
  check('categories', () => document.querySelectorAll('#catTabs .cat-tab').length);
  check('footerComms', () => document.querySelectorAll('#footerCommsContainer a, #footerCommsContainer span.wanas-comm').length);
  
  // === LOGIN ===
  document.getElementById('adminBtn').click();
  document.getElementById('adminPass').value = 'wanas123';
  document.getElementById('adminLoginBtn').click();
  // wait for next tick
  setTimeout(() => {
    check('adminUnlocked', () => !document.getElementById('adminPanel').classList.contains('hidden'));
    
    // === FEATURE 1: Change password ===
    document.querySelector('#settingsTabs button[data-st="password"]').click();
    document.getElementById('cfgCurPass').value = 'wanas123';
    document.getElementById('cfgNewPass').value = 'testpass1';
    document.getElementById('cfgConfirmPass').value = 'testpass1';
    document.getElementById('savePassBtn').click();
    setTimeout(() => {
      check('pwToast', () => document.getElementById('toast').textContent);
      check('pwFieldsCleared', () => document.getElementById('cfgNewPass').value === '' && document.getElementById('cfgConfirmPass').value === '');
      
      // === FEATURE 2: Branding (words) ===
      document.querySelector('#settingsTabs button[data-st="branding"]').click();
      check('brandArOrig', () => document.getElementById('cfgBrandAr').value);
      check('brandEnOrig', () => document.getElementById('cfgBrandEn').value);
      check('heroArOrig', () => document.getElementById('cfgHeroTitleAr').value);
      check('heroEnOrig', () => document.getElementById('cfgHeroTitleEn').value);
      check('footArOrig', () => document.getElementById('cfgFooterAr').value);
      check('footEnOrig', () => document.getElementById('cfgFooterEn').value);
      
      document.getElementById('cfgBrandAr').value = 'وَنَس مُحدَّث';
      document.getElementById('cfgBrandEn').value = 'Wanas Updated';
      document.getElementById('cfgHeroTitleAr').value = 'هدايا جديدة';
      document.getElementById('cfgHeroTitleEn').value = 'New Gifts';
      document.getElementById('cfgFooterAr').value = 'تذييل جديد 🕯️';
      document.getElementById('cfgFooterEn').value = 'New footer 🕯️';
      document.getElementById('saveBrandingBtn').click();
      setTimeout(() => {
        check('brandToast', () => document.getElementById('toast').textContent);
        applyLang();
        check('heroUpdated', () => document.querySelector('.hero h1').textContent);
        check('footUpdated', () => document.getElementById('footerTaglineText').textContent);
        check('brandWordText', () => document.querySelector('.brand-word') ? document.querySelector('.brand-word').textContent : 'NOT_FOUND');
        
        // === FEATURE 3: Font/size/color ===
        document.getElementById('cfgBrandFont').value = 'Arial';
        document.getElementById('cfgBrandSize').value = '2.0';
        document.getElementById('cfgBrandColor').value = '#ff0000';
        document.getElementById('cfgHeroFont').value = 'Georgia';
        document.getElementById('cfgHeroSize').value = '3.0';
        document.getElementById('cfgHeroColor').value = '#0000ff';
        document.getElementById('saveBrandingBtn').click();
        setTimeout(() => {
          applyLang();
          check('brandFontApplied', () => document.querySelector('.brand-word').style.fontFamily);
          check('brandColorApplied', () => document.querySelector('.brand-word').style.color);
          check('heroFontApplied', () => document.querySelector('.hero h1').style.fontFamily);
          check('heroColorApplied', () => document.querySelector('.hero h1').style.color);
          
          // === FEATURE 6: Categories add/edit ===
          check('catListCount', () => document.querySelectorAll('#catList .list-item').length);
          check('catTabsCount', () => document.querySelectorAll('#catTabs .cat-tab').length);
          
          document.getElementById('newCatAr').value = 'فئة تجريبية';
          document.getElementById('newCatEn').value = 'Test Category';
          document.getElementById('addCatBtn').click();
          setTimeout(() => {
            check('catAfterAdd', () => document.querySelectorAll('#catList .list-item').length);
            check('catTabsAfterAdd', () => document.querySelectorAll('#catTabs .cat-tab').length);
            
            // Edit category
            const editBtns = document.querySelectorAll('#catList .ed-cat');
            if (editBtns.length > 0) {
              editBtns[0].click();
              setTimeout(() => {
                check('editCatModal', () => document.getElementById('editCatModal').classList.contains('show'));
                document.getElementById('editCatAr').value = 'فئة مُعدَّلة';
                document.getElementById('editCatEn').value = 'Edited Category';
                document.getElementById('editCatSave').click();
                setTimeout(() => {
                  check('catAfterEdit', () => document.querySelector('#catList .list-item').textContent);
                  
                  // === FEATURE 7: Wrong password counter ===
                  document.getElementById('adminBtn').click();
                  document.getElementById('adminPass').value = 'WRONG';
                  document.getElementById('adminLoginBtn').click();
                  setTimeout(() => {
                    check('wrongToast', () => document.getElementById('toast').textContent);
                    check('attemptsDisplay', () => document.getElementById('wrongAttemptsDisplay') ? document.getElementById('wrongAttemptsDisplay').textContent : 'none');
                    
                    // === FEATURE 8: Market price → discount ===
                    document.querySelector('#settingsTabs button[data-st="market"]').click();
                    check('marketListExists', () => !!document.getElementById('marketList'));
                    const mInput = document.querySelector('[data-id="ptest"]');
                    if (mInput) {
                      mInput.value = '300';
                      mInput.dispatchEvent(new Event('change'));
                    }
                    setTimeout(() => {
                      try {
                        const s = JSON.parse(localStorage.getItem('wanas_settings')||'{}');
                        check('marketSaved', () => s.marketPrices ? s.marketPrices.ptest : 'none');
                      } catch(e) { check('marketSaved', 'parse_error'); }
                      
                      // Reload to see discount badge
                      location.reload();
                      setTimeout(() => {
                        const ptestCards = Array.from(document.querySelectorAll('#productGrid .card'));
                        const ptestCard = ptestCards.find(c => c.querySelector('h3') && c.querySelector('h3').textContent.includes('وردة'));
                        if (ptestCard) {
                          const badge = ptestCard.querySelector('.discount-badge');
                          check('ptestDiscount', () => badge ? badge.textContent : 'no_badge');
                        } else {
                          check('ptestDiscount', 'not_found');
                        }
                        
                        // === FEATURE 9: Payment info ===
                        document.querySelector('#settingsTabs button[data-st="payment"]').click();
                        check('vodafoneOrig', () => document.getElementById('cfgVodafone').value);
                        check('instapayOrig', () => document.getElementById('cfgInstapay').value);
                        check('bankOrig', () => document.getElementById('cfgBank').value);
                        check('whatsappOrig', () => document.getElementById('cfgWhatsapp').value);
                        check('emailOrig', () => document.getElementById('cfgEmail').value);
                        
                        document.getElementById('cfgVodafone').value = '0123456789';
                        document.getElementById('cfgBank').value = 'Bank: CIB\nIBAN: EG123';
                        document.getElementById('savePaymentBtn').click();
                        setTimeout(() => {
                          check('paymentToast', () => document.getElementById('toast').textContent);
                          check('vodafoneAfter', () => document.getElementById('cfgVodafone').value);
                          check('bankAfter', () => document.getElementById('cfgBank').value);
                          
                          // === FEATURE 10: Communication methods ===
                          check('commListCount', () => document.querySelectorAll('#commList .contact-item').length);
                          check('footerCommsCount', () => document.querySelectorAll('#footerCommsContainer a, #footerCommsContainer span.wanas-comm').length);
                          
                          document.getElementById('cfgCommIcon').value = '✈️';
                          document.getElementById('cfgCommAr').value = 'تيليغرام';
                          document.getElementById('cfgCommEn').value = 'Telegram';
                          document.getElementById('cfgCommValue').value = 'https://t.me/test';
                          document.getElementById('cfgCommType').value = 'social';
                          document.getElementById('addCommBtn').click();
                          setTimeout(() => {
                            check('commAfterAdd', () => document.querySelectorAll('#commList .contact-item').length);
                            check('footerCommsAfterAdd', () => document.querySelectorAll('#footerCommsContainer a, #footerCommsContainer span.wanas-comm').length);
                            
                            // Delete comm
                            const delBtns = document.querySelectorAll('#commList .del-comm, #commList .contact-item .btn.danger.sm');
                            if (delBtns.length > 0) {
                              delBtns[0].click();
                              setTimeout(() => {
                                check('commAfterDel', () => document.querySelectorAll('#commList .contact-item').length);
                                
                                // === FEATURE 11: GitHub publish ===
                                document.querySelector('#settingsTabs button[data-st="github"]').click();
                                check('ghPanelExists', () => !!document.querySelector('.settings-panel[data-sp="github"]'));
                                check('ghTitle', () => document.querySelector('[data-i18n="gh_title"]').textContent);
                                check('ghTokenField', () => document.getElementById('ghToken').value);
                                check('ghStatus', () => document.getElementById('ghStatus').textContent);
                                check('ghBtnText', () => document.getElementById('ghPublishBtn').textContent);
                                check('ghSaveBtn', () => !!document.getElementById('ghSaveBtn'));
                                check('ghClearBtn', () => !!document.getElementById('ghClearBtn'));
                                check('ghPublishBtn', () => !!document.getElementById('ghPublishBtn'));
                                check('ghWarning', () => document.querySelector('[data-i18n="gh_warning"]').textContent);
                                
                                // Save and clear token
                                document.getElementById('ghToken').value = 'ghp_faketoken123';
                                document.getElementById('ghSaveBtn').click();
                                setTimeout(() => {
                                  check('ghSavedToast', () => document.getElementById('toast').textContent);
                                  check('ghTokenAfter', () => document.getElementById('ghToken').value);
                                  
                                  document.getElementById('ghClearBtn').click();
                                  setTimeout(() => {
                                    check('ghClearedToast', () => document.getElementById('toast').textContent);
                                    check('ghTokenAfterClear', () => document.getElementById('ghToken').value);
                                    
                                    logResults();
                                    summary();
                                  }, 300);
                                }, 300);
                              }, 300);
                            } else {
                              check('commAfterDel', 'no_delete_btn');
                              check('ghPanelExists', () => !!document.querySelector('.settings-panel[data-sp="github"]'));
                              // ... rest of F11
                              logResults();
                              summary();
                            }
                          }, 300);
                        }, 300);
                      }, 500);
                    }, 300);
                  }, 300);
                }, 300);
              }, 300);
            } else {
              check('catAfterEdit', 'no_edit_btn');
              // skip to F7
              document.getElementById('adminBtn').click();
              document.getElementById('adminPass').value = 'WRONG';
              document.getElementById('adminLoginBtn').click();
              setTimeout(() => {
                check('wrongToast', () => document.getElementById('toast').textContent);
                check('attemptsDisplay', () => document.getElementById('wrongAttemptsDisplay') ? document.getElementById('wrongAttemptsDisplay').textContent : 'none');
                // ... continue to F8+
                location.reload();
                setTimeout(() => {
                  // F8+ same as above
                  document.querySelector('#settingsTabs button[data-st="market"]').click();
                  const mInput = document.querySelector('[data-id="ptest"]');
                  if (mInput) { mInput.value = '300'; mInput.dispatchEvent(new Event('change')); }
                  setTimeout(() => {
                    try { const s = JSON.parse(localStorage.getItem('wanas_settings')||'{}'); check('marketSaved', () => s.marketPrices ? s.marketPrices.ptest : 'none'); } catch(e) { check('marketSaved','err'); }
                    location.reload();
                    setTimeout(() => {
                      const ptestCards = Array.from(document.querySelectorAll('#productGrid .card'));
                      const pc = ptestCards.find(c => c.querySelector('h3') && c.querySelector('h3').textContent.includes('وردة'));
                      check('ptestDiscount', () => pc && pc.querySelector('.discount-badge') ? pc.querySelector('.discount-badge').textContent : 'none');
                      // F9
                      document.querySelector('#settingsTabs button[data-st="payment"]').click();
                      check('vodafoneOrig', () => document.getElementById('cfgVodafone').value);
                      document.getElementById('cfgVodafone').value = '0123456789';
                      document.getElementById('cfgBank').value = 'Bank: CIB\nIBAN: EG123';
                      document.getElementById('savePaymentBtn').click();
                      setTimeout(() => {
                        check('vodafoneAfter', () => document.getElementById('cfgVodafone').value);
                        // F10
                        document.querySelector('#settingsTabs button[data-st="payment"]').click();
                        check('commListCount', () => document.querySelectorAll('#commList .contact-item').length);
                        document.getElementById('cfgCommIcon').value = '✈️';
                        document.getElementById('cfgCommAr').value = 'تيليغرام';
                        document.getElementById('cfgCommEn').value = 'Telegram';
                        document.getElementById('cfgCommValue').value = 'https://t.me/test';
                        document.getElementById('cfgCommType').value = 'social';
                        document.getElementById('addCommBtn').click();
                        setTimeout(() => {
                          check('commAfterAdd', () => document.querySelectorAll('#commList .contact-item').length);
                          const delBtns = document.querySelectorAll('#commList .del-comm, #commList .contact-item .btn.danger.sm');
                          if (delBtns.length > 0) { delBtns[0].click(); setTimeout(() => { check('commAfterDel', () => document.querySelectorAll('#commList .contact-item').length); F11(); }, 300); }
                          else { check('commAfterDel','no_del'); F11(); }
                        }, 300);
                      }, 300);
                    }, 500);
                  }, 300);
                }, 300);
              }, 300);
            }
          }, 300);
        }, 300);
      }, 300);
    }, 300);
  }, 500);
  
  function F11() {
    document.querySelector('#settingsTabs button[data-st="github"]').click();
    check('ghPanelExists', () => !!document.querySelector('.settings-panel[data-sp="github"]'));
    check('ghTitle', () => document.querySelector('[data-i18n="gh_title"]').textContent);
    check('ghBtnText', () => document.getElementById('ghPublishBtn').textContent);
    check('ghWarning', () => document.querySelector('[data-i18n="gh_warning"]').textContent);
    check('ghSaveBtn', () => !!document.getElementById('ghSaveBtn'));
    check('ghClearBtn', () => !!document.getElementById('ghClearBtn'));
    document.getElementById('ghToken').value = 'ghp_faketoken123';
    document.getElementById('ghSaveBtn').click();
    setTimeout(() => {
      check('ghSavedToast', () => document.getElementById('toast').textContent);
      check('ghTokenAfter', () => document.getElementById('ghToken').value);
      document.getElementById('ghClearBtn').click();
      setTimeout(() => {
        check('ghClearedToast', () => document.getElementById('toast').textContent);
        check('ghTokenAfterClear', () => document.getElementById('ghToken').value);
        logResults();
        summary();
      }, 300);
    }, 300);
  }
})();
