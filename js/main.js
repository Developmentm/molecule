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
    if(submitBtn) submitBtn.addEventListener('click',function(){
      var codeInput=wizard.querySelector('[name="code"]');
      if(codeInput){
        form.code=codeInput.value.replace(/\D/g,'');
        if(form.code!==otp){
          setError('code','The confirmation code doesn\'t match. Please re-enter it.');
          return;
        }
      }
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
