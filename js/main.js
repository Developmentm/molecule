document.addEventListener('DOMContentLoaded',function(){

  // ========= HEADER SCROLL =========
  var header=document.querySelector('.site-header');
  if(header){
    function onScroll(){
      if(window.scrollY>24) header.classList.add('scrolled');
      else header.classList.remove('scrolled');
    }
    onScroll();
    window.addEventListener('scroll',onScroll,{passive:true});
  }

  // ========= MOBILE MENU =========
  var mobileToggle=document.querySelector('.mobile-toggle');
  var mobileMenu=document.querySelector('.mobile-menu');
  if(mobileToggle&&mobileMenu){
    mobileToggle.addEventListener('click',function(){
      var isOpen=mobileMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded',isOpen);
      var svg=mobileToggle.querySelector('use');
      if(svg) svg.setAttribute('href',isOpen?'#icon-x':'#icon-menu');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded','false');
        var svg=mobileToggle.querySelector('use');
        if(svg) svg.setAttribute('href','#icon-menu');
      });
    });
  }

  // ========= WHATSAPP FLOATING BUTTON =========
  (function(){
    var waNumber='918169659377';
    var waMessage=encodeURIComponent("Hi Development Molecule team, I'd like to know more about your services.");
    var waLink=document.createElement('a');
    waLink.href='https://wa.me/'+waNumber+'?text='+waMessage;
    waLink.target='_blank';
    waLink.rel='noopener noreferrer';
    waLink.className='whatsapp-float';
    waLink.setAttribute('aria-label','Chat with us on WhatsApp');
    waLink.innerHTML='<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.362.687 4.564 1.872 6.417L4 29l7.786-1.83A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3zm0 21.818c-1.94 0-3.75-.53-5.302-1.452l-.38-.225-4.62 1.086 1.11-4.51-.248-.396A9.77 9.77 0 0 1 5.19 15c0-5.968 4.85-10.818 10.814-10.818S26.818 9.032 26.818 15 22.968 24.818 16.004 24.818zm5.99-8.146c-.328-.164-1.94-.957-2.24-1.066-.3-.11-.518-.164-.737.164-.219.328-.845 1.066-1.036 1.285-.19.219-.382.246-.71.082-.328-.164-1.386-.51-2.64-1.628-.976-.87-1.635-1.945-1.826-2.273-.19-.328-.02-.505.144-.668.148-.147.328-.383.492-.574.164-.19.219-.328.328-.547.11-.219.055-.41-.027-.574-.082-.164-.737-1.778-1.01-2.434-.266-.64-.537-.553-.737-.563l-.628-.011c-.219 0-.574.082-.874.41-.3.328-1.147 1.12-1.147 2.735 0 1.614 1.174 3.174 1.338 3.393.164.219 2.31 3.527 5.596 4.945.782.338 1.393.54 1.869.69.785.25 1.5.215 2.065.13.63-.094 1.94-.793 2.213-1.558.273-.766.273-1.422.191-1.559-.082-.137-.3-.219-.628-.383z"/></svg>';
    document.body.appendChild(waLink);
  })();

  // ========= REVEAL ANIMATIONS =========
  if('IntersectionObserver' in window){
    var reveals=document.querySelectorAll('.reveal');
    var observer=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('reveal-in');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:0.12,rootMargin:'0px 0px -60px 0px'});
    reveals.forEach(function(el){observer.observe(el)});
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('reveal-in');
    });
  }

  // ========= CONTACT WIZARD =========
  var wizard=document.querySelector('.wizard');
  if(wizard){
    var currentStep=0;
    var otp='';
    var form={name:'',company:'',email:'',phone:'',service:'',budget:'',timeline:'',message:'',code:''};

    var steps=wizard.querySelectorAll('.wizard-step');
    var progressDots=wizard.querySelectorAll('.wizard-progress span');
    var stepLabel=wizard.querySelector('.step-label');
    var stepTitle=wizard.querySelector('.step-title');
    var backBtn=wizard.querySelector('.wizard-back');
    var nextBtn=wizard.querySelector('.wizard-next');
    var submitBtn=wizard.querySelector('.wizard-submit');
    var successPanel=wizard.querySelector('.wizard-success');
    var wizardForm=wizard.querySelector('.wizard-form');
    var stepNames=['Your details','Requirement','Project details','Verify & confirm'];

    function showStep(n){
      steps.forEach(function(s,i){s.style.display=i===n?'block':'none'});
      progressDots.forEach(function(d,i){
        if(i<=n) d.classList.add('active');
        else d.classList.remove('active');
      });
      if(stepLabel) stepLabel.textContent='Step '+(n+1)+' of 4';
      if(stepTitle) stepTitle.textContent=stepNames[n];
      if(backBtn) backBtn.disabled=n===0;
      if(nextBtn) nextBtn.style.display=n<3?'inline-flex':'none';
      if(submitBtn) submitBtn.style.display=n===3?'inline-flex':'none';
    }

    function clearErrors(){
      wizard.querySelectorAll('.error').forEach(function(e){e.textContent=''});
    }

    function setError(name,msg){
      var el=wizard.querySelector('.error-'+name);
      if(el) el.textContent=msg;
    }

    function validateStep(){
      clearErrors();
      var valid=true;
      if(currentStep===0){
        var name=wizard.querySelector('[name="name"]').value.trim();
        var company=wizard.querySelector('[name="company"]').value.trim();
        var email=wizard.querySelector('[name="email"]').value.trim();
        var phone=wizard.querySelector('[name="phone"]').value.trim();
        if(name.length<2){setError('name','Please enter your full name');valid=false}
        if(company.length<2){setError('company','Please enter your company name');valid=false}
        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setError('email','Enter a valid email address');valid=false}
        if(phone.length<7){setError('phone','Enter a valid phone number');valid=false}
        if(valid){form.name=name;form.company=company;form.email=email;form.phone=phone}
      } else if(currentStep===1){
        if(!form.service){setError('service','Select the service you\'re interested in');valid=false}
      } else if(currentStep===2){
        var budget=wizard.querySelector('[name="budget"]').value;
        var timeline=wizard.querySelector('[name="timeline"]').value;
        var message=wizard.querySelector('[name="message"]').value.trim();
        if(!budget){setError('budget','Select a budget range');valid=false}
        if(!timeline){setError('timeline','Select a timeline');valid=false}
        if(message.length<20){setError('message','Please describe your project in at least 20 characters');valid=false}
        if(valid){form.budget=budget;form.timeline=timeline;form.message=message}
      }
      return valid;
    }

    function populateReview(){
      var review=wizard.querySelector('.review-data');
      if(!review) return;
      review.innerHTML='';
      var fields=[['Name',form.name],['Company',form.company],['Email',form.email],['Phone',form.phone],['Service',form.service],['Budget',form.budget],['Timeline',form.timeline]];
      fields.forEach(function(f){
        var div=document.createElement('div');
        var dt=document.createElement('dt');dt.textContent=f[0];
        var dd=document.createElement('dd');dd.textContent=f[1];
        div.appendChild(dt);div.appendChild(dd);
        review.appendChild(div);
      });
      var msgEl=wizard.querySelector('.review-message');
      if(msgEl) msgEl.textContent=form.message;
    }

    function generateOtp(){
      otp=String(Math.floor(100000+Math.random()*900000));
      var otpDisplay=wizard.querySelector('.otp-code');
      if(otpDisplay) otpDisplay.textContent=otp;
    }

    // Service option buttons
    wizard.querySelectorAll('.service-option').forEach(function(btn){
      btn.addEventListener('click',function(){
        wizard.querySelectorAll('.service-option').forEach(function(b){b.classList.remove('selected')});
        btn.classList.add('selected');
        form.service=btn.getAttribute('data-service');
        clearErrors();
      });
    });

    // Back button
    if(backBtn) backBtn.addEventListener('click',function(){
      if(currentStep>0){currentStep--;showStep(currentStep)}
    });

    // Next button
    if(nextBtn) nextBtn.addEventListener('click',function(){
      if(!validateStep()) return;
      if(currentStep===2){
        populateReview();
        generateOtp();
      }
      currentStep++;
      showStep(currentStep);
    });

    // Submit button
    var NOTIFY_EMAIL='offcourseunderstoodyou@gmail.com';

    function mailtoFallback(){
      var body=[
        'Name: '+form.name,
        'Company: '+form.company,
        'Email: '+form.email,
        'Phone: '+form.phone,
        'Service: '+form.service,
        'Budget: '+form.budget,
        'Timeline: '+form.timeline,
        '',
        form.message
      ].join('\n');
      return 'mailto:'+NOTIFY_EMAIL+'?subject='+encodeURIComponent('New enquiry from developmentmolecule.com — '+form.name)+'&body='+encodeURIComponent(body);
    }

    function showSuccess(){
      if(wizardForm) wizardForm.style.display='none';
      if(successPanel){
        successPanel.style.display='block';
        var nameEl=successPanel.querySelector('.success-name');
        if(nameEl) nameEl.textContent=form.name.split(' ')[0];
        var emailEl=successPanel.querySelector('.success-email');
        if(emailEl) emailEl.textContent=form.email;
        var serviceEl=successPanel.querySelector('.success-service');
        if(serviceEl) serviceEl.textContent=form.service.toLowerCase();
      }
    }

    if(submitBtn) submitBtn.addEventListener('click',function(){
      var codeInput=wizard.querySelector('[name="code"]');
      if(codeInput){
        form.code=codeInput.value.replace(/\D/g,'');
        if(form.code!==otp){
          setError('code','The confirmation code doesn\'t match. Please re-enter it.');
          return;
        }
      }

      var originalLabel=submitBtn.textContent;
      submitBtn.disabled=true;
      submitBtn.textContent='Sending...';

      var fd=new FormData();
      fd.append('Name',form.name);
      fd.append('Company',form.company);
      fd.append('Email',form.email);
      fd.append('Phone',form.phone);
      fd.append('Service',form.service);
      fd.append('Budget',form.budget);
      fd.append('Timeline',form.timeline);
      fd.append('Message',form.message);
      fd.append('_subject','New enquiry from developmentmolecule.com — '+form.name);
      fd.append('_replyto',form.email);

      fetch('https://formspree.io/'+NOTIFY_EMAIL,{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:fd
      }).then(function(res){
        submitBtn.disabled=false;
        submitBtn.textContent=originalLabel;
        if(!res.ok){ window.location.href=mailtoFallback(); }
        showSuccess();
      }).catch(function(){
        submitBtn.disabled=false;
        submitBtn.textContent=originalLabel;
        window.location.href=mailtoFallback();
        showSuccess();
      });
    });

    // Reset
    var resetBtn=wizard.querySelector('.wizard-reset');
    if(resetBtn) resetBtn.addEventListener('click',function(){
      form={name:'',company:'',email:'',phone:'',service:'',budget:'',timeline:'',message:'',code:''};
      currentStep=0;
      wizard.querySelectorAll('input,textarea,select').forEach(function(el){el.value=''});
      wizard.querySelectorAll('.service-option').forEach(function(b){b.classList.remove('selected')});
      if(wizardForm) wizardForm.style.display='block';
      if(successPanel) successPanel.style.display='none';
      showStep(0);
    });

    // Code input filter
    var codeInput=wizard.querySelector('[name="code"]');
    if(codeInput){
      codeInput.addEventListener('input',function(){
        this.value=this.value.replace(/\D/g,'');
      });
    }

    showStep(0);
  }

});
