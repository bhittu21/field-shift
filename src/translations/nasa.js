/* Strings used only when real NASA POWER data has been loaded (src/data/nasa-power.js). */
(function (SC) {
  'use strict';
  SC.addStrings({
    bn: {
      'meta.desc': 'আমার ফসল: বাংলাদেশের কৃষকদের জন্য আবহাওয়ার পরিবর্তন ও ফসল আবর্তনের সম্ভাবনা বোঝার একটি ডেমো। সব সংখ্যা কৃত্রিম উদাহরণ।',
      'meta.descReal': 'আমার ফসল: বাংলাদেশের কৃষকদের জন্য আবহাওয়ার পরিবর্তন ও ফসল আবর্তনের সম্ভাবনা বোঝার একটি প্রোটোটাইপ। তাপমাত্রা ও বৃষ্টি নাসা POWER থেকে। মাটির আর্দ্রতা, গাছপালা ও ফসল আবর্তনের মান উদাহরণ।',
      'demo.badgeReal': 'আংশিক নাসা POWER তথ্য',
      'demo.hintReal': 'তাপমাত্রা ও বৃষ্টি নাসা POWER থেকে সংগৃহীত। মাটির আর্দ্রতা, গাছপালা ও ফসল আবর্তনের মান উদাহরণ।',
      'climate.noticeReal': 'তাপমাত্রা, খুব গরম দিন ও বৃষ্টির সংখ্যা নাসা POWER থেকে {date} তারিখে সংগৃহীত, জেলা-কেন্দ্রের একটি বিন্দুর জন্য। এগুলো শুধু {range} সময়ের গড়। নাসা POWER-এর আগের বছরের তথ্য এই বিন্দুগুলোর জন্য সামঞ্জস্যপূর্ণ নয়, তাই আগে-এখন তুলনা দেখানো হয়নি। মাটির আর্দ্রতা ও গাছপালার সবুজতা এখনো কৃত্রিম ডেমো মান। কোনোটিই আপনার মাঠের পরিমাপ নয়।',
      'card.avgReal': '{range} সময়ের গড়। আগের সময়ের সঙ্গে তুলনা দেখানো হয়নি।',
      'chart.avgFull': 'গড় ({range})',
      'shift.sum.hotReal': '{range} সময়ে বছরে গড়ে {n}টি খুব গরম দিন (নাসা POWER)।',
      'shift.sum.rainReal': '{range} সময়ে বছরে গড় বৃষ্টি {n} মিমি (নাসা POWER)।',
      'shift.sum.onsetReal': '{range} সময়ে ভারী বৃষ্টি সাধারণত শুরু হয়েছে প্রায় {date} (নাসা POWER)।',
      'dash.hintReal': 'তাপমাত্রা ও বৃষ্টি নাসা POWER থেকে, জেলা-কেন্দ্রের বিন্দুর জন্য। মাটির আর্দ্রতা ও গাছপালার মান উদাহরণ।',
      'src.leadReal': 'এই সংস্করণে শুধু নাসা POWER থেকে তাপমাত্রা ও বৃষ্টির তথ্য সংগৃহীত হয়েছে ({date})। বাকি উৎস এখনো সংযুক্ত নয়।',
      'src.honestyReal': 'স্বচ্ছতার কথা: "যাচাইকৃত উৎস" মানে তথ্য ওই উৎস থেকে সংগৃহীত ও ফাইলে সংরক্ষিত, লাইভ সংযোগ নয়। "ডেমো তথ্য" মানে সংখ্যা কৃত্রিম উদাহরণ, প্রকৃত পর্যবেক্ষণ নয়।',
      'src.note.powerReal': 'তাপমাত্রা, খুব গরম দিন, বৃষ্টি ও ভারী বৃষ্টি শুরুর মান এই উৎস থেকে {date} তারিখে সংগৃহীত। ফাইলে সংরক্ষিত, লাইভ সংযোগ নয়।',
      'src.power.usedReal': 'জলবায়ু অংশের "তাপমাত্রা" ও "বৃষ্টি" কার্ড এবং গরম দিন, মাসিক বৃষ্টি ও ভারী বৃষ্টি শুরুর চার্ট',
      'src.gpm.usedReal': 'এখনো কোথাও দেখানো হয়নি। বৃষ্টির মান এখন নাসা POWER থেকে।',
      'about.dataReal': 'তাপমাত্রা, খুব গরম দিন ও বৃষ্টির মান নাসা POWER থেকে {date} তারিখে সংগৃহীত, জেলা-কেন্দ্রের একটি বিন্দুর জন্য, {range} সময়ের গড় হিসেবে। মাটির আর্দ্রতা, গাছপালার সূচক, বপনের সময় ও ফসল আবর্তনের মান কৃত্রিম বা অযাচাইকৃত উদাহরণ। কোনো গবেষণা-উদ্ধৃতি দেওয়া হয়নি।',
      'footer.nasaFile': 'নাসা POWER তথ্য',
      'footer.nasaReal': 'তাপমাত্রা ও বৃষ্টি {date} তারিখে সংগৃহীত, ফাইলে সংরক্ষিত। লাইভ সংযোগ নয়।',
      'footer.dataMixed': 'মাটির আর্দ্রতা, গাছপালা ও আবর্তনের মান কৃত্রিম ডেমো।',
      'card.src.real': 'উৎস: নাসা POWER ({param}), {date} তারিখে সংগৃহীত',
      'chart.hot.descReal': 'দিনের সর্বোচ্চ তাপমাত্রা {t} °সে বা বেশি হলে খুব গরম দিন ধরা হয়েছে। সংখ্যাটি বছরে গড়।',
      'chart.rain.descReal': 'প্রতি মাসে গড় বৃষ্টি, নাসা POWER থেকে।',
      'chart.onset.descReal': 'ভারী বৃষ্টি শুরু = ১ এপ্রিলের পর প্রথম যে দিন আগের ৭ দিনে মোট {mm} মিমি বা বেশি বৃষ্টি। এটি এই প্রকল্পের নিজস্ব সরল সংজ্ঞা। দিন গোনা ১ এপ্রিল থেকে।'
    },
    en: {
      'meta.desc': 'Amar Foshol: a bilingual (Bangla/English) demonstration of climate change and crop rotation possibilities for farmers in Bangladesh. All numbers are synthetic examples.',
      'meta.descReal': 'Amar Foshol: a bilingual (Bangla/English) prototype for climate change and crop rotation possibilities for farmers in Bangladesh. Temperature and rainfall come from NASA POWER. Soil moisture, vegetation, and rotation values are illustrative.',
      'demo.badgeReal': 'Partly real NASA POWER data',
      'demo.hintReal': 'Temperature and rainfall come from NASA POWER. Soil moisture, vegetation, and rotation values are illustrative.',
      'climate.noticeReal': 'Temperature, very hot days, and rainfall were retrieved from NASA POWER on {date} for one point at each district centre. They are averages for {range} only. Earlier years of the NASA POWER record for these points are not consistent, so no then-vs-now comparison is shown. Soil moisture and vegetation greenness are still synthetic demo values. None of it is a measurement of your field.',
      'card.avgReal': 'Average for {range}. No comparison with an earlier period.',
      'chart.avgFull': 'Average ({range})',
      'shift.sum.hotReal': 'In {range}, there were about {n} very hot days a year on average (NASA POWER).',
      'shift.sum.rainReal': 'In {range}, average yearly rain was {n} mm (NASA POWER).',
      'shift.sum.onsetReal': 'In {range}, heavy rain usually started around {date} (NASA POWER).',
      'dash.hintReal': 'Temperature and rainfall come from NASA POWER for a district-centre point. Soil moisture and vegetation values are illustrative.',
      'src.leadReal': 'In this version only temperature and rainfall were retrieved, from NASA POWER ({date}). The other sources are not connected yet.',
      'src.honestyReal': 'Transparency note: "Verified Source" means the data was retrieved from that source and saved in a file, not a live connection. "Demo Data" means the numbers are synthetic examples, not real observations.',
      'src.note.powerReal': 'Temperature, very hot days, rainfall, and heavy-rain onset were retrieved from this source on {date}. Saved in a file, not a live connection.',
      'src.power.usedReal': 'The "Temperature" and "Rainfall" cards and the hot-day, monthly-rain, and heavy-rain-onset charts in the climate section',
      'src.gpm.usedReal': 'Not shown anywhere yet. Rainfall now comes from NASA POWER.',
      'about.dataReal': 'Temperature, very hot days, and rainfall were retrieved from NASA POWER on {date} for one point at each district centre, as averages for {range}. Soil moisture, vegetation index, sowing windows, and rotation values are synthetic or unverified examples. No research citations are given.',
      'footer.nasaFile': 'NASA POWER data',
      'footer.nasaReal': 'Temperature and rainfall retrieved on {date}, saved in a file. Not a live connection.',
      'footer.dataMixed': 'Soil moisture, vegetation, and rotation values are synthetic demo values.',
      'card.src.real': 'Source: NASA POWER ({param}), retrieved {date}',
      'chart.hot.descReal': 'A day counts as very hot when its maximum temperature is {t} °C or more. The number is a yearly average.',
      'chart.rain.descReal': 'Average rain in each month, from NASA POWER.',
      'chart.onset.descReal': 'Heavy-rain onset = the first day after 1 April when the previous 7 days total {mm} mm or more. This is a simple definition made for this project. Days are counted from 1 April.'
    }
  });
})(window.SC = window.SC || {});
