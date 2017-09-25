<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:x="urn:schemas-microsoft-com:office:excel"
xmlns="http://www.w3.org/TR/REC-html40">

<head>
<meta http-equiv=Content-Type content="text/html; charset=windows-1252">

<!--[if !mso]>
<style>
v\:* {behavior:url(#default#VML);}
o\:* {behavior:url(#default#VML);}
x\:* {behavior:url(#default#VML);}
.shape {behavior:url(#default#VML);}
</style>
<![endif]-->
<link rel=Stylesheet href="/timeticket_files/stylesheet.css">
<style>
<!--table
	{mso-displayed-decimal-separator:"\.";
	mso-displayed-thousand-separator:"\,";}
@page
	{margin:.75in .25in .75in .25in;
	mso-header-margin:.3in;
	mso-footer-margin:.3in;}
-->
</style>

 
   <script src="/js/app.js"></script>
   <script type = "text/javascript">

    

          
           window.onload =
            function()
            {
               
                adjustInvoiceColumns();
                

            };
          
  

</script>

</head>

<body link="#0563C1" vlink="#954F72">

<div id = "invoice_main" style="background-color:white;">
<table border=0 cellpadding=0 cellspacing=0 width=754 style='border-collapse:
 collapse;table-layout:fixed;width:546pt'>
 <col width=64 style='width:48pt'>
 <col width=51 style='mso-width-source:userset;mso-width-alt:1820;width:38pt'>
 <col width=64 style='width:48pt'>
 <col width=40 style='mso-width-source:userset;mso-width-alt:1422;width:30pt'>
 <col width=36 style='mso-width-source:userset;mso-width-alt:1280;width:27pt'>
 <col width=44 style='mso-width-source:userset;mso-width-alt:1564;width:33pt'>
 <col width=38 style='mso-width-source:userset;mso-width-alt:1365;width:29pt'>
 <col width=75 style='mso-width-source:userset;mso-width-alt:2673;width:56pt'>
 <col width=90 style='mso-width-source:userset;mso-width-alt:3214;width:68pt'>
 <col width=58 style='mso-width-source:userset;mso-width-alt:2048;width:43pt'>
 <col width=5 style='mso-width-source:userset;mso-width-alt:170;width:4pt'>
 <col width=50 style='mso-width-source:userset;mso-width-alt:1792;width:38pt'>
 <col width=46 style='mso-width-source:userset;mso-width-alt:1649;width:35pt'>
 <col width=65 style='mso-width-source:userset;mso-width-alt:2304;width:49pt'>
 <tr height=20 style='mso-height-source:userset;height:15.0pt'>
  <td colspan=7 rowspan=5 height=96 style='border-right:.5pt solid black;
  border-bottom:.5pt solid black;height:72.6pt;width:253pt' align=left
  valign=top><span
  style='mso-ignore:vglayout2'>
  <table cellpadding=0 cellspacing=0>
   <tr>
    <td colspan=7 rowspan=5 height=96 class=xl107 width=337 style='border-right:
    .5pt solid black;border-bottom:.5pt solid black;height:72.6pt;width:253pt'><span style="mso-ignore: vglayout; position: absolute; z-index: 1; margin-left: 9px; margin-top: 16px; width: 291px; height: 42px; left: 6px; top: 39px;"><img style="position: absolute; width: 325px; height: 64px; left: -5px; top: -22px;" top=10 width=332 height=65 src="/timeticket_files/image002.png" v:shapes="Picture_x0020_1"></span></td>
   </tr>
  </table>
  </span></td>
  <td colspan=7 rowspan=2 class=xl103 style='width:293pt'>DAILY WORK
  TICKET</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=7 rowspan=3 height=57 class=xl104 style='height:43.2pt'>{{$data_summary->ticket_number}}</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=14 height=19 class=xl105 style='height:14.4pt'><a
  href="http://www.onsite3d.ca/" target="_parent">WWW.ONSITE3D.CA</a></td>
 </tr>
 <tr height=10 style='mso-height-source:userset;height:8.25pt'>
  <td colspan=2 rowspan=2 height=29 class=xl84 style='border-right:.5pt solid black;
  border-bottom:.5pt solid black;height:22.65pt'>CUSTOMER</td>
  <td colspan=5 rowspan=2 class=xl84 style='border-right:.5pt solid black;
  border-bottom:.5pt solid black'>{{$data_summary->project->customer_rep->company_name}}</td>
  <td colspan=2 rowspan=2 class=xl84 style='border-right:.5pt solid black;
  border-bottom:.5pt solid black'>DATE</td>
  <td colspan=5 rowspan=2 class=xl106>{{date_create($data_summary->date)->format('M, d Y')}}</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=12 style='mso-height-source:userset;height:9.0pt'>
  <td colspan=2 rowspan=2 height=31 class=xl84 style='border-right:.5pt solid black;border-bottom:.5pt solid black;height:23.4pt'>MAILING&nbsp;ADDRESS</td>
  <td colspan=5 rowspan=2 class=xl84 style='overflow:hidden; border-right:.5pt solid black; border-bottom:.5pt solid black'>{{ $data_summary->project->customer_rep->mailing_address }}</td>
  <td colspan=2 rowspan=2 class=xl84 style='border-right:.5pt solid black;border-bottom:.5pt solid black'>LOCATION</td>
  <td colspan=5 rowspan=2 class=xl102 style='width:169pt'>{{$data_summary->project->location}}</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 rowspan=2 height=27 class=xl84 style='border-right:.5pt solid black;
  border-bottom:.5pt solid black;height:20.4pt'>CUSTOMER REP.</td>
  <td colspan=5 rowspan=2 class=xl91 style='border-right:.5pt solid black; border-bottom:.5pt solid black; overflow:hidden'>{{$data_summary->project->customer_rep->email}}</td>
  <td colspan=2 rowspan=2 class=xl84 style='border-right:.5pt solid blackborder-bottom:.5pt solid black'>JOB NO.</td>
  <td colspan=5 rowspan=2 class=xl115>{{$data_summary->project->old_job_num}}</td>
 </tr>
 <tr height=8 style='mso-height-source:userset;height:6.0pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=14 height=19 class=xl116 style='height:14.4pt'>&nbsp;</td>
 </tr>
 <tr height=20 style='mso-height-source:userset;height:15.0pt'>
  <td colspan=14 rowspan=4 height=77 class=xl117 style='height:58.2pt;
  width:546pt'>{{$description}}</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=8 rowspan=2 height=38 class=xl99 style='height:28.8pt'>LABOUR<span tyle='mso-spacerun:yes'></span></td>
  <td colspan=6 rowspan=2 class=xl99>EQUIPMENT</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl70 style='border-right:.5pt solid black;height:14.4pt'>NAME</td>
  <td class=xl70 style='border-top:none;border-left:none'>OCC.</td>
  <td class=xl70 style='border-top:none;border-left:none'>RATE</td>
  <td class=xl70 style='border-top:none;border-left:none'>REG</td>
  <td class=xl70 style='border-top:none;border-left:none'>OT</td>
  <td class=xl70 style='border-top:none;border-left:none'>TRVL</td>
  <td class=xl70 style='border-top:none;border-left:none'>TOTAL</td>
  <td class=xl70 style='border-top:none;border-left:none'>DESCRIPTION</td>
  <td colspan=2 class=xl70 style='border-right:.5pt solid black;border-left:none'>UNIT NO.</td>
  <td class=xl70 style='border-top:none;border-left:none'>RATE</td>
  <td class=xl70 style='border-top:none;border-left:none'>HOURS</td>
  <td class=xl70 style='border-top:none;border-left:none'>TOTAL</td>
 </tr>

 @foreach($line_items as $line_item)
  <tr class =lineItems height=21 style='height:15.6pt'>
    <td colspan=2 height=21 class=xl118 style='height:15.6pt'>{{$line_item['emp_name']}}</td>
    <td class=xl78 style='overflow: hidden; border-top:none'>{{$line_item['emp_occ']}}</td>
    <td class=xl67 align=right style='border-top:none;border-left:none'>{{ $line_item['emp_rate']}}</td>
    <td class=xl67 align=right style='border-top:none;border-left:none'>{{$line_item['emp_reg']}}</td>
    <td class=xl67 align=right style='border-top:none;border-left:none'>{{$line_item['emp_ot']}}</td>
    <td class=xl67 style='border-top:none;border-left:none'>{{$line_item['emp_trvl']}}</td>

    @if($line_item['emp_total'] === "&nbsp;")
       <td  class=xl75 style='border-top:none;border-left:none;text-align:center;'>&nbsp;</td>
    @else
      <td  class=xl75 style='border-top:none;border-left:none;text-align:center;'><div class = currency>{{$line_item['emp_total']}}</div></td>
    @endif
    
    <td class=xl69 style='border-top:none'>{{$line_item['equip_name']}}</td>
    <td colspan=2 class=xl83 style='border-right:.5pt solid black;border-left:none'>{{$line_item['equip_unitNo']}}</td>
    <td class=xl71 style='border-top:none;border-left:none'>{{$line_item['equip_rate']}}</td>
    <td class=xl71 style='border-top:none;border-left:none'>{{$line_item['equip_hours']}}</td>
    <td class=xl76 style='border-top:none;border-left:none'>{{$line_item['equip_total']}}</td>
  </tr>
 @endforeach

 <tr class=lineTotals height=19 style='height:14.4pt'>
  <td height=19 colspan=2 style='height:14.4pt;mso-ignore:colspan'></td>
  <td colspan=2 class=xl143 style='border-right:.5pt solid black'>TOTAL</td>
  <td colspan=4 class=xl138 style='border-left:none'><div class = currency>{{number_format($labour_total, 2)}}</div<</td>
  <td class=xl67 style='border-top:none'>&nbsp;</td>
  <td class=xl68 style='border-left:none'>TOTAL</td>
  <td colspan=4 class=xl140 style='border-right:.5pt solid black;border-left:none'><div class = currency>{{number_format($equip_total, 2)}}</div></td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=7 height=19 class=xl132 style='border-right:.5pt solid black;height:14.4pt'>CUSTOMER&nbsp;AUTHORIZATION</td>
  <td colspan=7 class=xl99 style='border-left:none'>DELIVERABLE&nbsp;DATA</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>CUSTOMER</td>
  <td colspan=5 class=xl115 style='border-left:none'>{{$data_summary->project->customer_rep->company_name}}</td>
  <td colspan=2 class=xl65 style='border-left:none'>DESCRIPTION</td>
  <td class=xl65 style='border-top:none;border-left:none'>PRICE</td>
  <td colspan=2 class=xl135 style='border-right:.5pt solid black;border-left:none'>REF&nbsp;FNO.</td>
  <td colspan=2 class=xl145 style='border-right:.5pt solid black;border-left:none'>TOTAL</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>PROJECT ID#</td>
  <td colspan=5 class=xl71 style='border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl83 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td class=xl77 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl147 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td colspan=2 class=xl146 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>CC/AFE#</td>
  <td colspan=5 class=xl71 style='border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl67 style='border-left:none'>&nbsp;</td>
  <td class=xl67 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl130 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td colspan=2 class=xl130 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>CUSTOMER REP.</td>
  <td colspan=5 class=xl71 style='border-left:none'>{{$data_summary->project->customer_rep->first_name}}&nbsp;{{$data_summary->project->customer_rep->last_name}}</td>
  <td colspan=2 class=xl67 style='border-left:none'>&nbsp;</td>
  <td class=xl67 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:none'>&nbsp;</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>CONTACT PHONE</td>
  <td colspan=5 class=xl71 style='border-left:none'>{{$data_summary->project->customer_rep->phone}}</td>
  <td colspan=2 class=xl67 style='border-left:none'>&nbsp;</td>
  <td class=xl67 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=2 height=19 class=xl137 style='height:14.4pt'>CONTACT EMAIL</td>
  <td colspan=5 class=xl124 style='border-left:none; overflow: hidden;'>{{$data_summary->project->customer_rep->email}}</td>
  <td colspan=2 class=xl67 style='border-left:none'>&nbsp;</td>
  <td class=xl67 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
 </tr>
 <tr height=20 style='mso-height-source:userset;height:15.0pt'>
  <td colspan=7 height=20 class=xl125 style='border-right:.5pt solid black;height:15.0pt;width:253pt'>SIGNATURE&nbsp;&amp;&nbsp;OR&nbsp;STAMP</td>
  <td colspan=2 class=xl67 style='border-left:none'>&nbsp;</td>
  <td class=xl67 style='border-top:none;border-left:none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
  <td colspan=2 class=xl88 style='border-right:.5pt solid black;border-left:
  none'>&nbsp;</td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td colspan=7 rowspan=7 height=133 class=xl123 style='height:100.8pt;width:253pt'>&nbsp;</td>
  <td style='border-left:solid 1px black;'></td>
  <td></td>
  <td class=xl67 style='border-top:none'>TOTAL</td>
  <td colspan=4 class=xl128 style='border-left:none;'><span style='mso-spacerun:yes'></span>$<span style='mso-spacerun:yes'></span>-<span style='mso-spacerun:yes'></span></td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td height=19 style='height:14.4pt; border-left:solid 1px black;'></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
  <td></td>
 </tr>
 <tr class = dailyWorkTotal height=19 style='height:14.4pt'>
  <td colspan=3 height=19 class=xl71 style='height:14.4pt'>DAILY WORK TICKET TOTAL</td>
  <td colspan=4 class=xl121 style='border-left:none'><div class = currency>{{ number_format($sub_total, 2) }}</div></td>
 </tr>
 <tr class = gstTotal height=19 style='height:14.4pt'>
  <td colspan=3 height=19 class=xl122 style='height:14.4pt'>77084 2722 RT0001 G.S.T</td>
  <td colspan=4 class=xl121 style='border-left:none'><div class = currency>{{ number_format($gst, 2) }}</div></td>
 </tr>
 <tr height=19 style='height:14.4pt'>
  <td height=19 style='height:14.4pt;border-left:solid 1px black; '></td>
  <td></td>
  <td></td>
  <td colspan=2 class=xl73></td>
  <td class=xl73></td>
  <td></td>
 </tr>
 <tr class=grandTotal height=19 style='height:14.4pt'>
  <td colspan=3 height=19 class=xl67 style='height:14.4pt'>DAILY WORK TICKET TOTAL</td>
  <td colspan=4 class=xl121 style='border-left:none'><div class = currency>{{ number_format($grand_total, 2) }}</div></td>
 </tr>
 <tr height=19 style='page-break-before:always;height:14.4pt'>
  <td height=19 colspan=7 style='height:14.4pt;mso-ignore:colspan'></td>
 </tr>

</table>
</div>
 @if($show_print_button)
    <a href="/dailyworkticket_toPDF/{{$data_summary->id}}" class="button">Print PDF</a>
 @endif

</body>

</html>
