"use strict";(self.webpackChunkmatrimony=self.webpackChunkmatrimony||[]).push([[7561],{24146:(e,t,s)=>{s.d(t,{A:()=>r});var i=s(34535),a=s(96446),l=s(19252),o=s(70579);const n=(0,i.Ay)(a.A)((e=>{let{theme:t}=e;return`\n        padding: ${t.spacing(1)};\n`})),r=e=>{let{children:t}=e;return(0,o.jsx)(n,{className:"MuiPageTitle-wrapper",children:(0,o.jsx)(l.A,{maxWidth:"lg",children:t})})}},94786:(e,t,s)=>{s.d(t,{A:()=>a});s(65043);var i=s(70579);const a=e=>{const{title:t}=e;return(0,i.jsx)("div",{className:"spinner-container",children:(0,i.jsx)("div",{className:"loading-spinner"})})}},66659:(e,t,s)=>{s.r(t),s.d(t,{default:()=>ae});var i=s(29490),a=s(24146),l=s(34535),o=s(83462),n=s(26600),r=s(17392),d=s(26240),c=s(96446),g=s(68903),h=s(88911),u=s(22698),m=s(85865),p=s(11906),x=s(53193),A=s(67784),j=s(51787),v=s(19252),y=s(12110),b=s(39336),f=s(79650),S=s(43845),C=s(69392),k=s(4598),I=s(92598),R=s(63336),T=s(35316),P=s(81673),w=s(98533),O=s(29347),N=s(26688),D=s(63471),z=s(39155),H=s(74802),B=s(33639),M=s(73216),L=s(35475),W=s(65043),F=s(11633),$=s(94786),q=s(66360),_=s(47503),G=(s(92342),s(8740),s(92823)),U=s.n(G),E=(s(25884),s(61072)),V=s(78602),J=s(1433),X=s(58390),Y=s(74379),Z=s(47257),K=s(69525),Q=s(70579);const ee={toolbar:{container:[[{header:[1,2,!1]}],["bold","italic","underline","strike"],["blockquote","code-block"],["link","image","video","formula"],[{list:"ordered"},{list:"bullet"},{list:"check"}],[{script:"sub"},{script:"super"}],[{indent:"-1"},{indent:"+1"}],[{direction:"rtl"}],[{size:["small",!1,"large","huge"]}],[{header:[1,2,3,4,5,6,!1]}],[{color:[]},{background:[]}],[{font:[]}],[{align:[]}],["clean"]]}},te=(0,l.Ay)(o.A)((e=>{let{theme:t}=e;return{"& .MuiDialogContent-root":{padding:t.spacing(2)},"& .MuiDialogActions-root":{padding:t.spacing(1)},"& .MuiPaper-root":{height:"890px"}}}));function se(e){const{children:t,onClose:s,...i}=e;return(0,Q.jsxs)(n.A,{sx:{m:0,p:2,fontSize:"18px",fontWeight:"bold"},...i,children:[t,s?(0,Q.jsx)(r.A,{"aria-label":"close",onClick:s,sx:{position:"absolute",right:13,top:13,color:e=>e.palette.grey[500]},children:(0,Q.jsx)(H.A,{})}):null]})}const ie={id:0,title:"",description:"",tags:[],authorName:"",image:"",publishDate:""};const ae=function(){let[e,t]=(0,W.useState)("");const s=(0,M.Zp)();let[l,H]=(0,W.useState)();const[G,ae]=W.useState(ie),[le,oe]=(0,W.useState)([]),[ne,re]=W.useState(!1);let[de,ce]=W.useState("");const[ge,he]=(0,W.useState)(0),[ue,me]=(0,W.useState)(10),[pe,xe]=(0,W.useState)(10),[Ae,je]=(0,W.useState)(!1),[ve,ye]=(0,W.useState)(!1),[be,fe]=(0,W.useState)(!1),[Se,Ce]=(0,W.useState)(""),[ke,Ie]=(0,W.useState)(!1),[Re,Te]=(0,W.useState)(""),[Pe,we]=(0,W.useState)(!1),[Oe,Ne]=(0,W.useState)(""),[De,ze]=(0,W.useState)(!1),[He,Be]=(0,W.useState)(""),[Me,Le]=(0,W.useState)(!1);let[We,Fe]=(0,W.useState)(""),[$e,qe]=(0,W.useState)([]),[_e,Ge]=(0,W.useState)();const[Ue,Ee]=(0,W.useState)(!0),[Ve,Je]=(0,W.useState)(!0),[Xe,Ye]=(0,W.useState)(!0),[Ze,Ke]=(0,W.useState)(!0);let Qe="MM/dd/yyyy";if(sessionStorage.getItem("DateFormat")){let e=sessionStorage.getItem("DateFormat");Qe=JSON.parse(e)}(0,W.useRef)(null),W.useEffect((()=>{let e=JSON.parse(localStorage.getItem("Credentials"));if(H(e),e)if(1!=e.roleId){let t=e.pagePermissions.findIndex((e=>"Block Users"===e.title));t>=0&&(Ee(e.pagePermissions[t].isReadPermission),Je(e.pagePermissions[t].isAddPermission),Ye(e.pagePermissions[t].isEditPermission),Ke(e.pagePermissions[t].isDeletePermission),e.pagePermissions[t].isReadPermission&&tt(),et())}else tt(),et()}),[]);const et=async()=>{let e=await fetch("/admin/variable.json"),t=await e.json();Ge(t),_e=t},tt=async()=>{await st(ge,ue),re(!1)},st=async(t,i)=>{try{if(e){const a=localStorage.getItem("SessionToken"),l=localStorage.getItem("RefreshToken");let o={startIndex:t,fetchRecord:i,name:e||""};const n=await F.A.httpPost("/api/admin/blog/getBlogs",o,a,l);if(n.recordList&&n.recordList.length>0)for(let e=0;e<n.recordList.length;e++)n.recordList[e].formatdate=new Date(n.recordList[e].publishDate).toLocaleDateString("en-US");oe(n.recordList),xe(n.totalRecords),n&&200==n.status?re(!1):401==n.status?(localStorage.clear(),s("/admin")):(500==n.status||400==n.status||300==n.status||404==n.status)&&(re(!1),_.oR.error(n.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT})),Le(!1)}else{Le(!0);const e=localStorage.getItem("SessionToken"),a=localStorage.getItem("RefreshToken");let l={startIndex:t,fetchRecord:i};const o=await F.A.httpPost("/api/admin/blog/getBlogs",l,e,a);if(o.recordList&&o.recordList.length>0)for(let t=0;t<o.recordList.length;t++)o.recordList[t].formatdate=new Date(o.recordList[t].publishDate).toLocaleDateString("en-US");oe(o.recordList),xe(o.totalRecords),o&&200==o.status?re(!1):401==o.status?(localStorage.clear(),s("/admin")):(500==o.status||400==o.status||300==o.status||404==o.status)&&(re(!1),_.oR.error(o.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT})),Le(!1)}}catch(a){re(!1),_.oR.error(a,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT}),Le(!1)}},it=e=>{const{name:t,value:s}=e.target;ae({...G,[t]:s}),re(!0)},at=new RegExp("^[a-zA-Z0-9 ]+$"),lt=async()=>{ae(ie),ce(""),re(!0),fe(!1),Ce(""),ze(!1),Be(""),Ie(!1),Te(""),we(!1),Ne(""),Fe(""),qe([])},ot=()=>{re(!1)},nt=async e=>{G.tags=$e||null;var t=(e=>{e.preventDefault();var t=!0;return G.title?(fe(!1),Ce("")):(fe(!0),Ce("Title is required"),t=!1),G.description?(Ie(!1),Te("")):(Ie(!0),Te("Description is required"),t=!1),G.image?(ze(!1),Be("")):(ze(!0),Be("Image is required"),t=!1),G.tags&&0==G.tags.length?(we(!0),Ne("Value list is required"),t=!1):(we(!1),Ne("")),t})(e);if(t)try{if(Le(!0),G.image=G.image?G.image:null,G.publishDate=G.publishDate?G.publishDate:null,G.authorName=G.authorName?G.authorName:null,G.id){const e=localStorage.getItem("SessionToken"),t=localStorage.getItem("RefreshToken");let i=G;i.isActive=1==G.isActive,i.isDelete=1==G.isDelete;const a=await F.A.httpPost("/api/admin/blog/updateBlog",i,e,t);a&&200==a.status?(re(!1),st(ge*ue,ue),_.oR.success("Blog Updated Successfully.",{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT})):401==a.status?(s("/admin"),localStorage.clear()):(500==a.status||300==a.status||404==a.status||400==a.status)&&(re(!1),_.oR.error(a.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT}))}else{const e=localStorage.getItem("SessionToken"),t=localStorage.getItem("RefreshToken");let i=G;const a=await F.A.httpPost("/api/admin/blog/insertBlog",i,e,t);a&&200==a.status?(he(0),re(!1),st(0,ue),_.oR.success("Blog Added Successfully.",{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT})):401==a.status?(s("/admin"),localStorage.clear()):(500==a.status||300==a.status||404==a.status||400==a.status)&&(re(!1),_.oR.error(a.message,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT}))}Le(!1)}catch(i){Le(!1),re(!1),_.oR.error(i,{autoClose:6e3,hideProgressBar:!0,closeOnClick:!0,pauseOnHover:!0,draggable:!0,progress:void 0,theme:"colored",position:_.oR.POSITION.TOP_RIGHT})}},rt=()=>{je(!1),ye(!1)},dt=(0,d.A)();return(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(_.N9,{style:{top:"10%",left:"80%"},autoClose:6e3,hideProgressBar:!0,newestOnTop:!1,closeOnClick:!0,rtl:!1,pauseOnFocusLoss:!0,draggable:!0,pauseOnHover:!0}),(0,Q.jsx)(i.mg,{children:(0,Q.jsx)("title",{children:"Blog"})}),(0,Q.jsx)(a.A,{children:(0,Q.jsx)(c.A,{p:1,children:(0,Q.jsxs)(g.Ay,{container:!0,justifyContent:"space-between",alignItems:"center",children:[(0,Q.jsx)(g.Ay,{item:!0,children:(0,Q.jsx)(h.A,{alignItems:"left",justifyContent:"space-between",children:(0,Q.jsxs)(u.A,{"aria-label":"breadcrumb",children:[(0,Q.jsx)(L.N_,{to:"/admin",style:{display:"flex",color:"black"},children:(0,Q.jsx)(B.A,{})}),(0,Q.jsx)(m.A,{color:"inherit",variant:"subtitle2",fontWeight:"bold",children:"Blog"})]})})}),(0,Q.jsx)(g.Ay,{item:!0,children:(0,Q.jsxs)(g.Ay,{container:!0,spacing:1.5,children:[(0,Q.jsx)(g.Ay,{item:!0,children:Ve?(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsxs)(p.A,{className:"buttonLarge",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:lt,size:"small",children:[(0,Q.jsx)(z.A,{fontSize:"small"}),"Create Blog"]}),(0,Q.jsx)(p.A,{className:"button",sx:{mt:{xs:0,md:0,display:"flex",alignItems:"center",padding:"8.3px",top:"3px"}},variant:"contained",onClick:lt,size:"small",children:(0,Q.jsx)(z.A,{fontSize:"small"})})]}):(0,Q.jsx)(Q.Fragment,{})}),(0,Q.jsx)(g.Ay,{item:!0,children:(0,Q.jsx)(x.A,{sx:{mt:{xs:.3,md:.3,lg:.3,sm:.3}},children:(0,Q.jsx)(A.A,{name:"searchString",value:e,onChange:s=>(s=>{t(s.target.value),e=s.target.value,st(ge,ue)})(s),id:"outlined-basic",label:"Search",variant:"outlined",size:"small",InputProps:{startAdornment:(0,Q.jsx)(j.A,{position:"start",children:(0,Q.jsx)(q.A,{})})}})})})]})})]})})}),(0,Q.jsx)(v.A,{maxWidth:"lg",children:(0,Q.jsx)(g.Ay,{children:(0,Q.jsx)(g.Ay,{children:(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(y.A,{className:"communitycard",children:(0,Q.jsx)("div",{children:Me?(0,Q.jsx)($.A,{title:"Loading..."}):(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(b.A,{}),le&&le.length>0?(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(f.A,{className:"communitytableContainer",children:(0,Q.jsx)(E.A,{style:{padding:"25px",width:"100%"},children:le.map(((e,t)=>(0,Q.jsx)(V.A,{hover:!0,sm:12,md:4,style:{marginBottom:"25px"},children:(0,Q.jsxs)(y.A,{className:"blogCard",children:[(0,Q.jsx)(m.A,{className:"chip-container",children:(0,Q.jsx)(S.A,{label:e.tags[0],children:e.tags[0]})}),(0,Q.jsx)(m.A,{style:{height:"150px",width:"auto"},children:e.image?(0,Q.jsx)("img",{src:e.image,alt:"blog Url",style:{height:"100%",width:"100%",objectFit:"cover"}}):(0,Q.jsx)("img",{src:"/dummy.png",alt:"notification Url",style:{height:"100%",width:"100%"}})}),(0,Q.jsxs)(g.Ay,{style:{padding:"13px 0px"},children:[(0,Q.jsx)("h6",{children:e.title}),(0,Q.jsxs)(m.A,{className:"detail",children:[e.authorName&&(0,Q.jsxs)("span",{children:["\xa0",e.authorName]}),e.publishDate&&(0,Q.jsxs)("span",{children:["\xa0\xa0",e.publishDate?(0,K.default)(new Date(e.publishDate),Qe):"--"]})]}),(0,Q.jsx)(m.A,{className:"description",dangerouslySetInnerHTML:{__html:e.description}}),(0,Q.jsx)(m.A,{style:{color:"grey",cursor:"pointer"},onClick:t=>{(e=>{let t=null===e||void 0===e?void 0:e.id;s(`/admin/blog/view/${t}`)})(e)},children:"Read More..."}),(0,Q.jsx)(m.A,{className:"icon-container",children:Xe?(0,Q.jsxs)(Q.Fragment,{children:[(0,Q.jsx)(C.A,{title:0===e.isActive?"Inactive":"Active",arrow:!0,children:(0,Q.jsx)(k.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),checked:0!==e.isActive,onClick:t=>(async(e,t)=>{ae({id:e,status:t}),je(!0)})(e.id,e.isActive),inputProps:{"aria-label":"controlled"}})}),(0,Q.jsx)(C.A,{title:"Edit",arrow:!0,children:(0,Q.jsx)(r.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),sx:{"&:hover":{background:dt.colors.primary.lighter},color:dt.palette.primary.main},color:"inherit",size:"small",onClick:t=>(e=>{if(e.image?ce(e.image):ce(""),e.tags&&"string"===typeof e.tags){const t=e.tags.includes(";")?e.tags.split(";"):[e.tags];e.tags=t}qe(e.tags),ae(e),console.log(G),re(!0),fe(!1),Ce(""),ze(!1),Be(""),Ie(!1),Te(""),we(!1),Ne("")})(e),"data-toggle":"modal","data-target":"#exampleModal",children:(0,Q.jsx)(N.A,{fontSize:"small"})})}),(0,Q.jsx)(C.A,{title:"Delete",arrow:!0,children:(0,Q.jsx)(r.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),sx:{"&:hover":{background:dt.colors.primary.lighter},color:dt.palette.primary.main},color:"inherit",size:"small",onClick:t=>(async e=>{ae({id:e}),ye(!0)})(e.id),"data-toggle":"modal","data-target":"#exampleModal",children:(0,Q.jsx)(D.A,{fontSize:"small"})})})]}):(0,Q.jsx)(Q.Fragment,{})})]})]})},t)))})}),(0,Q.jsx)(c.A,{p:2,children:(0,Q.jsx)(I.A,{component:"div",count:pe,onPageChange:(e,t)=>{he(t),st(t*ue,ue)},onRowsPerPageChange:e=>{me(parseInt(e.target.value)),he(0),st(0,parseInt(e.target.value))},page:ge,rowsPerPage:ue,rowsPerPageOptions:[10,20,30,40]})})]}):(0,Q.jsx)(R.A,{sx:{display:"flex",justifyContent:"center",alignItems:"center",textAlign:"center",verticalAlign:"middle",boxShadow:"none"},className:"communitycard",children:(0,Q.jsx)(m.A,{variant:"h5",paragraph:!0,children:"Data not Found"})})]})})}),(0,Q.jsx)("div",{children:(0,Q.jsxs)(te,{open:ne,onClose:ot,PaperProps:{sx:{height:"40%"}},fullWidth:!0,maxWidth:"lg",children:[(0,Q.jsx)(se,{id:"customized-dialog-title",onClose:ot,children:G.id?"Edit Blod":"Add Blog"}),(0,Q.jsxs)(T.A,{dividers:!0,children:[(0,Q.jsx)(E.A,{children:(0,Q.jsxs)(V.A,{xs:12,md:12,children:[(0,Q.jsxs)(J.A,{style:{alignItems:"center"},children:[(0,Q.jsx)(m.A,{children:"Cover Image:"}),(0,Q.jsx)("input",{style:{display:"none"},id:"icon-button-file",type:"file",accept:"image/*",name:"image",onChange:e=>{(e=>{const t=e.target.files[0],s=e.target.name,i=new FileReader;i.onload=()=>{ce(i.result.toString()),ae({...G,[s]:i.result.toString()})},i.readAsDataURL(t)})(e),e.target.value?(ze(!1),Be("")):(ze(!0),Be("Image is required"))}}),(0,Q.jsx)("label",{htmlFor:"icon-button-file",style:{cursor:"pointer"},children:de?(0,Q.jsx)("img",{src:de,style:{height:"120px",width:"auto"}}):(0,Q.jsx)("img",{src:"/dummy.png",style:{height:"100px",width:"100px"}})})]}),(0,Q.jsx)(P.A,{style:{color:"red",height:"22px"},children:De&&He})]})}),(0,Q.jsx)(E.A,{children:(0,Q.jsxs)(V.A,{xs:12,children:[(0,Q.jsx)(A.A,{autoFocus:!0,margin:"dense",id:"title",label:"Title",type:"text",fullWidth:!0,variant:"outlined",name:"title",value:G.title,onChange:e=>{it(e),(e=>{const{name:t,value:s}=e.target;s?(fe(!1),Ce("")):(fe(!0),Ce("Title is required"))})(e)},required:!0}),(0,Q.jsx)(P.A,{style:{color:"red",height:"22px"},children:be&&Se})]})}),(0,Q.jsxs)(x.A,{fullWidth:!0,children:[(0,Q.jsx)("label",{children:"Description:"}),(0,Q.jsx)("div",{children:(0,Q.jsx)(U(),{theme:"snow",value:G.description,onChange:e=>{var t;t=e,ae({...G,description:t}),console.log(G),(e=>{e?(Ie(!1),Te("")):(Ie(!0),Te("Description is required"))})(e)},modules:ee})}),(0,Q.jsx)(P.A,{style:{color:"red",height:"22px"},children:ke&&Re})]}),(0,Q.jsxs)(E.A,{children:[(0,Q.jsx)(V.A,{xs:12,md:6,children:(0,Q.jsx)(A.A,{autoFocus:!0,margin:"dense",id:"authorname",label:"AuthorName",type:"text",fullWidth:!0,variant:"outlined",name:"authorName",value:G.authorName,onChange:e=>{it(e)},required:!0})}),(0,Q.jsx)(V.A,{xs:12,md:6,style:{paddingTop:"8px"},children:(0,Q.jsx)(X.$,{dateAdapter:Z.A,children:(0,Q.jsx)(Y.l,{label:"Publish Date",openTo:"day",views:["year","month","day"],value:G.publishDate,maxDate:G.validTo,onChange:e=>{var t;t=e,ae({...G,publishDate:t})},renderInput:e=>(0,Q.jsx)(A.A,{...e})})})})]}),(0,Q.jsx)(E.A,{children:(0,Q.jsxs)(V.A,{xs:12,children:[(0,Q.jsxs)(J.A,{style:{display:"flex"},children:[(0,Q.jsx)(A.A,{autoFocus:!0,margin:"dense",id:"tags",label:"Tags",type:"text",fullWidth:!0,variant:"outlined",name:"singleTag",value:We,onChange:e=>{(e=>{const{name:t,value:s}=e.target;Fe(s),re(!0)})(e),(e=>{e?(we(!1),Ne("")):(we(!0),Ne("Tag is required"))})(e)}}),(0,Q.jsx)(p.A,{sx:{mt:.5},variant:"outlined",onClick:()=>{at.test(We)?""!==We.trim()&&($e=$e?[...$e]:[],$e.push(We),qe($e),Fe(""),console.log($e)):(we(!0),Ne("Value is invalid."))},style:{border:"0px",borderLeft:"1px solid #ced4da",borderRadius:"0px",margin:"13px 0px 8px -68px"},children:"Add"})]}),(0,Q.jsx)(P.A,{style:{color:"red",height:"22px"},children:Pe&&Oe}),$e&&$e.length>0&&(0,Q.jsx)(m.A,{style:{display:"flex",flexWrap:"wrap"},children:$e.map(((e,t)=>(0,Q.jsx)(m.A,{style:{paddingBottom:"1.4%",paddingRight:"1.4%"},children:(0,Q.jsx)(S.A,{label:e,onDelete:e=>{var s;s=t,$e=$e.filter(((e,t)=>t!==s)),qe($e)},children:e},t)},t)))})]})})]}),(0,Q.jsx)(c.A,{sx:{display:"flex",justifyContent:"end",p:"8px"},children:(0,Q.jsxs)(m.A,{children:[(0,Q.jsx)(p.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),onClick:ot,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,Q.jsx)(p.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),onClick:e=>{nt(e)},variant:"outlined",style:{marginRight:"10px"},children:"Save"})]})})]})}),(0,Q.jsx)("div",{children:(0,Q.jsxs)(o.A,{open:Ae,onClose:rt,fullWidth:!0,maxWidth:"xs",children:[(0,Q.jsx)(n.A,{sx:{m:0,p:2,fontSize:"20px",fontWeight:"bolder"},children:0===G.status?"Inactive":"Active"}),(0,Q.jsx)(T.A,{children:(0,Q.jsx)(w.A,{style:{fontSize:"1rem",letterSpacing:"0.00938em"},children:0===G.status?"Are you sure you want to Active?":"Are you sure you want to Inactive?"})}),(0,Q.jsxs)(O.A,{children:[(0,Q.jsx)(p.A,{onClick:rt,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,Q.jsx)(p.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),onClick:async()=>{const e=localStorage.getItem("SessionToken"),t=localStorage.getItem("RefreshToken");let s={id:G.id};await F.A.httpPost("/api/admin/blog/activeInactiveBlog",s,e,t);je(!1),st(ge*ue,ue)},variant:"outlined",style:{marginRight:"10px"},children:"Yes"})]})]})}),(0,Q.jsx)("div",{children:(0,Q.jsxs)(o.A,{open:ve,onClose:rt,fullWidth:!0,maxWidth:"xs",children:[(0,Q.jsx)(n.A,{sx:{m:0,p:2,fontSize:"20px",fontWeight:"bolder"},children:"Delete"}),(0,Q.jsx)(T.A,{children:(0,Q.jsx)(w.A,{style:{fontSize:"1rem",letterSpacing:"0.00938em"},children:"Are you sure you want to Delete?"})}),(0,Q.jsxs)(O.A,{children:[(0,Q.jsx)(p.A,{onClick:rt,variant:"outlined",style:{marginRight:"10px"},children:"Cancel"}),(0,Q.jsx)(p.A,{disabled:"demo@admin.com"===(null===l||void 0===l?void 0:l.email),onClick:async()=>{const e=localStorage.getItem("SessionToken"),t=localStorage.getItem("RefreshToken");let s={id:G.id};await F.A.httpPost("/api/admin/blog/deleteBlog",s,e,t);ye(!1),st(ge*ue,ue)},variant:"outlined",style:{marginRight:"10px"},children:"Yes"})]})]})})]})})})})]})}},63471:(e,t,s)=>{var i=s(24994);t.A=void 0;var a=i(s(40039)),l=s(70579),o=(0,a.default)((0,l.jsx)("path",{d:"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"}),"Delete");t.A=o},10039:(e,t,s)=>{s.d(t,{A:()=>b});var i=s(98587),a=s(58168),l=s(65043),o=s(69292),n=s(98610),r=s(67266),d=s(6803),c=s(41009),g=s(21573),h=s(98206),u=s(34535),m=s(92532),p=s(72372);function x(e){return(0,p.Ay)("MuiTableCell",e)}const A=(0,m.A)("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]);var j=s(70579);const v=["align","className","component","padding","scope","size","sortDirection","variant"],y=(0,u.Ay)("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:s}=e;return[t.root,t[s.variant],t[`size${(0,d.A)(s.size)}`],"normal"!==s.padding&&t[`padding${(0,d.A)(s.padding)}`],"inherit"!==s.align&&t[`align${(0,d.A)(s.align)}`],s.stickyHeader&&t.stickyHeader]}})((e=>{let{theme:t,ownerState:s}=e;return(0,a.A)({},t.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:t.vars?`1px solid ${t.vars.palette.TableCell.border}`:`1px solid\n    ${"light"===t.palette.mode?(0,r.a)((0,r.X4)(t.palette.divider,1),.88):(0,r.e$)((0,r.X4)(t.palette.divider,1),.68)}`,textAlign:"left",padding:16},"head"===s.variant&&{color:(t.vars||t).palette.text.primary,lineHeight:t.typography.pxToRem(24),fontWeight:t.typography.fontWeightMedium},"body"===s.variant&&{color:(t.vars||t).palette.text.primary},"footer"===s.variant&&{color:(t.vars||t).palette.text.secondary,lineHeight:t.typography.pxToRem(21),fontSize:t.typography.pxToRem(12)},"small"===s.size&&{padding:"6px 16px",[`&.${A.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}},"checkbox"===s.padding&&{width:48,padding:"0 0 0 4px"},"none"===s.padding&&{padding:0},"left"===s.align&&{textAlign:"left"},"center"===s.align&&{textAlign:"center"},"right"===s.align&&{textAlign:"right",flexDirection:"row-reverse"},"justify"===s.align&&{textAlign:"justify"},s.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:(t.vars||t).palette.background.default})})),b=l.forwardRef((function(e,t){const s=(0,h.b)({props:e,name:"MuiTableCell"}),{align:r="inherit",className:u,component:m,padding:p,scope:A,size:b,sortDirection:f,variant:S}=s,C=(0,i.A)(s,v),k=l.useContext(c.A),I=l.useContext(g.A),R=I&&"head"===I.variant;let T;T=m||(R?"th":"td");let P=A;"td"===T?P=void 0:!P&&R&&(P="col");const w=S||I&&I.variant,O=(0,a.A)({},s,{align:r,component:T,padding:p||(k&&k.padding?k.padding:"normal"),size:b||(k&&k.size?k.size:"medium"),sortDirection:f,stickyHeader:"head"===w&&k&&k.stickyHeader,variant:w}),N=(e=>{const{classes:t,variant:s,align:i,padding:a,size:l,stickyHeader:o}=e,r={root:["root",s,o&&"stickyHeader","inherit"!==i&&`align${(0,d.A)(i)}`,"normal"!==a&&`padding${(0,d.A)(a)}`,`size${(0,d.A)(l)}`]};return(0,n.A)(r,x,t)})(O);let D=null;return f&&(D="asc"===f?"ascending":"descending"),(0,j.jsx)(y,(0,a.A)({as:T,ref:t,className:(0,o.A)(N.root,u),"aria-sort":D,scope:P,ownerState:O},C))}))},79650:(e,t,s)=>{s.d(t,{A:()=>x});var i=s(58168),a=s(98587),l=s(65043),o=s(69292),n=s(98610),r=s(98206),d=s(34535),c=s(92532),g=s(72372);function h(e){return(0,g.Ay)("MuiTableContainer",e)}(0,c.A)("MuiTableContainer",["root"]);var u=s(70579);const m=["className","component"],p=(0,d.Ay)("div",{name:"MuiTableContainer",slot:"Root",overridesResolver:(e,t)=>t.root})({width:"100%",overflowX:"auto"}),x=l.forwardRef((function(e,t){const s=(0,r.b)({props:e,name:"MuiTableContainer"}),{className:l,component:d="div"}=s,c=(0,a.A)(s,m),g=(0,i.A)({},s,{component:d}),x=(e=>{const{classes:t}=e;return(0,n.A)({root:["root"]},h,t)})(g);return(0,u.jsx)(p,(0,i.A)({ref:t,as:d,className:(0,o.A)(x.root,l),ownerState:g},c))}))},41009:(e,t,s)=>{s.d(t,{A:()=>i});const i=s(65043).createContext()},21573:(e,t,s)=>{s.d(t,{A:()=>i});const i=s(65043).createContext()},8740:()=>{}}]);
//# sourceMappingURL=7561.993b96e2.chunk.js.map