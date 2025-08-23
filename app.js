/* app.js – Logik */
const STORAGE_KEY = "familyRing_upd56b";
let people = [];
const undoStack = []; const redoStack = [];
const MAX_UNDO_STEPS = 50;

const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

/* === Utility === */
function saveState(pushUndo=true){
  if(pushUndo) {
    undoStack.push(JSON.stringify(people));
    if(undoStack.length > MAX_UNDO_STEPS) undoStack.shift();
  }
  redoStack.length = 0;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
}

function loadState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){ people = JSON.parse(raw); }
  else { people = seedData(); saveState(false); }
  postLoadFixups();
}

function seedData(){
  return [
    {Gen:1, Code:"1", Name:"Olaf Geppert", Birth:"13.01.1965", BirthPlace:"Chemnitz", Gender:"m", ParentCode:"", PartnerCode:"1x", InheritedFrom:"", Note:"Stammvater"},
    {Gen:1, Code:"1x", Name:"Irina Geppert", Birth:"13.01.1970", BirthPlace:"Berlin", Gender:"w", ParentCode:"", PartnerCode:"1", InheritedFrom:"", Note:"Partnerin"},
    {Gen:2, Code:"1A", Name:"Mario Geppert", Birth:"28.04.1995", BirthPlace:"Berlin", Gender:"m", ParentCode:"1", PartnerCode:"1Ax", InheritedFrom:"", Note:"1. Sohn"},
    {Gen:2, Code:"1Ax", Name:"Kim", Birth:"", BirthPlace:"", Gender:"w", ParentCode:"", PartnerCode:"1A", InheritedFrom:"", Note:"Partnerin"},
    {Gen:2, Code:"1B", Name:"Nicolas Geppert", Birth:"04.12.2000", BirthPlace:"Berlin", Gender:"m", ParentCode:"1", PartnerCode:"1Bx", InheritedFrom:"", Note:"2. Sohn"},
    {Gen:2, Code:"1Bx", Name:"Annika", Birth:"", BirthPlace:"", Gender:"w", ParentCode:"", PartnerCode:"1B", InheritedFrom:"", Note:"Partnerin"},
    {Gen:2, Code:"1C", Name:"Julienne Geppert", Birth:"26.09.2002", BirthPlace:"Berlin", Gender:"w", ParentCode:"1", PartnerCode:"1Cx", InheritedFrom:"", Note:"Tochter"},
    {Gen:2, Code:"1Cx", Name:"Jonas", Birth:"", BirthPlace:"", Gender:"m", ParentCode:"", PartnerCode:"1C", InheritedFrom:"", Note:"Partner"},
    {Gen:3, Code:"1C1", Name:"Michael Geppert", Birth:"12.07.2025", BirthPlace:"Hochstätten", Gender:"m", ParentCode:"1C", PartnerCode:"", InheritedFrom:"1", Note:""}
  ];
}

/* === Plausibilitätsprüfungen === */
function validateBirthDate(dateString) {
  const regex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;
  if (!regex.test(dateString)) return false;
  
  const parts = dateString.split('.');
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);
  
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && 
         date.getMonth() === month - 1 && 
         date.getDate() === day;
}

function validateRequiredFields(person) {
  return person.Name && person.Birth && person.Gender && 
         person.ParentCode && person.BirthPlace;
}

/* Compute Gen if missing */
function computeGenFromCode(code){
  if(!code) return 1;
  const base = code.replace(/x$/,'');
  if(base === "1") return 1;
  if(/^1[A-Z]$/.test(base)) return 2;
  if(/^1[A-Z]\d+$/.test(base)) return 3;
  if(/^1[A-Z]\d+[A-Z]$/.test(base)) return 4;
  
  let generation = 1;
  let current = base;
  while (current.length > 0) {
    if (current === "1") break;
    const lastChar = current.charAt(current.length - 1);
    if (/[A-Z]/.test(lastChar)) {
      generation++;
      current = current.slice(0, -1);
    } else if (/\d/.test(lastChar)) {
      generation++;
      current = current.replace(/\d+$/, '');
    } else {
      break;
    }
  }
  return Math.max(1, generation);
}

function postLoadFixups(){
  for(const p of people){
    p.Code = normalizePersonCode(p.Code);
    p.ParentCode = normalizePersonCode(p.ParentCode);
    p.PartnerCode = normalizePersonCode(p.PartnerCode);
    p.InheritedFrom = normalizePersonCode(p.InheritedFrom);
    p.Gen = computeGenFromCode(p.Code);
  }
  computeRingCodes();
}

/* Ring codes */
function computeRingCodes(){
  const byCode = Object.fromEntries(people.map(p=>[p.Code,p]));
  for(const p of people) p.RingCode = p.Code;
  
  const MAX_DEPTH = 20;
  let changed;
  let iterations = 0;
  
  do {
    changed = false;
    iterations++;
    for(const p of people){
      if(p.InheritedFrom && p.InheritedFrom !== ""){
        const donor = byCode[p.InheritedFrom];
        if(donor && donor.RingCode && !donor.RingCode.includes(p.Code)) {
          if(donor.RingCode.includes("→" + p.Code) || p.Code === donor.InheritedFrom) continue;
          const newRingCode = donor.RingCode + "→" + p.Code;
          if(p.RingCode !== newRingCode) {
            p.RingCode = newRingCode;
            changed = true;
          }
        }
      }
    }
    if(iterations >= MAX_DEPTH) break;
  } while (changed);
}

/* Render Table */
function renderTable(){
  computeRingCodes();
  const q = ($("#search").value||"").trim().toLowerCase();
  const tb = $("#peopleTable tbody"); 
  tb.innerHTML="";
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function mark(txt){
    if(!q) return escapeHtml(String(txt||""));
    const s = String(txt||""); 
    const i = s.toLowerCase().indexOf(q);
    if(i<0) return escapeHtml(s);
    return escapeHtml(s.slice(0,i)) + "<mark>" + escapeHtml(s.slice(i,i+q.length)) + "</mark>" + escapeHtml(s.slice(i+q.length));
  }
  
  const genColors = {
    1: "#e8f5e8", 2: "#e3f2fd", 3: "#f3e5f5", 
    4: "#fff3e0", 5: "#e8eaf6", 6: "#f1f8e9", 7: "#ffebee"
  };
  
  people.sort((a,b)=> (a.Gen||0)-(b.Gen||0) || String(a.Code).localeCompare(String(b.Code)));
  
  for(const p of people){
    const hay = (p.Name||"") + " " + (p.Code||"");
    if(q && hay.toLowerCase().indexOf(q)===-1) continue;
    
    const tr = document.createElement("tr");
    const cols = ["Gen","Code","RingCode","Name","Birth","BirthPlace","Gender","ParentCode","PartnerCode","InheritedFrom","Note"];
    
    const gen = p.Gen || 1;
    const bgColor = genColors[gen] || "#ffffff";
    tr.style.backgroundColor = bgColor;
    
    cols.forEach(k => {
      const td = document.createElement("td");
      td.innerHTML = mark(p[k] ?? "");
      tr.appendChild(td);
    });
    
    tr.addEventListener("dblclick", () => openEdit(p.Code));
    tb.appendChild(tr);
  }
}

/* === STAMMBAUM-DARSTELLUNG === */
function renderTree() {
    computeRingCodes();
    const el = $("#tree");
    el.innerHTML = "";
    
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 2400 1800");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    el.appendChild(svg);

    const genColors = {
        1: "#e8f5e8", 2: "#e3f2fd", 3: "#f3e5f5", 
        4: "#fff3e0", 5: "#e8eaf6", 6: "#f1f8e9", 7: "#ffebee"
    };

    const byGeneration = {};
    const partnerGroups = new Map();
    
    people.forEach(person => {
        const gen = person.Gen || 1;
        if (!byGeneration[gen]) byGeneration[gen] = [];
        byGeneration[gen].push(person);
        
        if (person.PartnerCode) {
            const partnerKey = [person.Code, person.PartnerCode].sort().join('-');
            if (!partnerGroups.has(partnerKey)) {
                partnerGroups.set(partnerKey, [person.Code, person.PartnerCode]);
            }
        }
    });

    // Größere Boxen und Schrift
    let maxBoxWidth = 220;
    people.forEach(person => {
        const name = person.Name || person.Code;
        const code = person.Code;
        const text = `${code} / ${name}`;
        const estimatedWidth = text.length * 9 + 60;
        if (estimatedWidth > maxBoxWidth) {
            maxBoxWidth = Math.min(estimatedWidth, 280);
        }
    });

    const boxWidth = maxBoxWidth + 80;
    const boxHeight = 110;
    const partnerGap = 40;
    const verticalSpacing = 240;

    const positions = new Map();
    const generations = Object.keys(byGeneration).sort((a, b) => a - b);

    generations.forEach((gen, genIndex) => {
        const persons = byGeneration[gen];
        const y = 160 + genIndex * verticalSpacing;
        
        const groupedPersons = [];
        const processed = new Set();
        
        persons.forEach(person => {
            if (processed.has(person.Code)) return;
            
            let partnerCodes = [];
            if (person.PartnerCode) {
                const partnerKey = [person.Code, person.PartnerCode].sort().join('-');
                partnerCodes = partnerGroups.get(partnerKey) || [];
            }
            
            if (partnerCodes.length > 0) {
                const partnerGroup = partnerCodes.map(code => 
                    persons.find(p => p.Code === code)
                ).filter(Boolean);
                groupedPersons.push(partnerGroup);
                partnerCodes.forEach(code => processed.add(code));
            } else {
                groupedPersons.push([person]);
                processed.add(person.Code);
            }
        });

        const rows = [];
        let currentRow = [];
        let currentRowWidth = 0;

        for (const group of groupedPersons) {
            const groupWidth = group.length === 2 ? 
                (boxWidth * 2 + partnerGap + 120) : (boxWidth + 120);
            
            if (currentRow.length > 0 && currentRowWidth + groupWidth > 2200) {
                rows.push(currentRow);
                currentRow = [];
                currentRowWidth = 0;
            }
            
            currentRow.push(group);
            currentRowWidth += groupWidth;
        }

        if (currentRow.length > 0) rows.push(currentRow);

        rows.forEach((rowGroups, rowIndex) => {
            const rowY = y + (rowIndex * 180);
            
            let totalRowWidth = 0;
            rowGroups.forEach(group => {
                totalRowWidth += group.length === 2 ? 
                    (boxWidth * 2 + partnerGap + 120) : (boxWidth + 120);
            });
            totalRowWidth -= 120;
            
            const startX = 200 + (2200 - totalRowWidth) / 2;
            let currentX = startX;
            
            rowGroups.forEach((group) => {
                if (group.length === 2) {
                    const partner1 = group[0];
                    const partner2 = group[1];
                    
                    positions.set(partner1.Code, { x: currentX + boxWidth/2, y: rowY, person: partner1 });
                    positions.set(partner2.Code, { x: currentX + boxWidth + partnerGap + boxWidth/2, y: rowY, person: partner2 });
                    
                    currentX += boxWidth * 2 + partnerGap + 120;
                } else {
                    const person = group[0];
                    positions.set(person.Code, { x: currentX + boxWidth/2, y: rowY, person: person });
                    currentX += boxWidth + 120;
                }
            });
        });
    });

    // Boxen zeichnen
    const nodesGroup = document.createElementNS(svgNS, "g");
    nodesGroup.setAttribute("class", "nodes");
    svg.appendChild(nodesGroup);

    const sortedPeople = [...people].sort((a, b) => {
        if (a.Gen !== b.Gen) return a.Gen - b.Gen;
        return a.Code.localeCompare(b.Code);
    });

    sortedPeople.forEach(person => {
        const pos = positions.get(person.Code);
        if (!pos) return;

        const gen = person.Gen || 1;
        const color = genColors[gen] || "#f9fafb";

        const personGroup = document.createElementNS(svgNS, "g");
        personGroup.setAttribute("class", "node");
        personGroup.setAttribute("transform", `translate(${pos.x - boxWidth/2}, ${pos.y})`);
        personGroup.setAttribute("data-code", person.Code);

        // Box
        const rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("width", boxWidth);
        rect.setAttribute("height", boxHeight);
        rect.setAttribute("rx", "8");
        rect.setAttribute("ry", "8");
        rect.setAttribute("fill", color);
        rect.setAttribute("stroke", "#374151");
        rect.setAttribute("stroke-width", "2");
        personGroup.appendChild(rect);

        // 1. Zeile: Größere Schrift
        const nameText = document.createElementNS(svgNS, "text");
        nameText.setAttribute("x", boxWidth/2);
        nameText.setAttribute("y", 40);
        nameText.setAttribute("text-anchor", "middle");
        nameText.setAttribute("font-size", "18");
        nameText.setAttribute("font-weight", "600");
        nameText.setAttribute("fill", "#111827");
        
        const displayName = person.Name || person.Code;
        const maxLength = Math.floor((boxWidth - 40) / 7);
        const displayText = displayName.length > maxLength ? 
            displayName.substring(0, maxLength - 3) + "..." : displayName;
        nameText.textContent = `${person.Code}: ${displayText}`;
        personGroup.appendChild(nameText);

        // 2. Zeile: Größere Schrift
        const detailsText = document.createElementNS(svgNS, "text");
        detailsText.setAttribute("x", boxWidth/2);
        detailsText.setAttribute("y", 70);
        detailsText.setAttribute("text-anchor", "middle");
        detailsText.setAttribute("font-size", "16");
        detailsText.setAttribute("fill", "#4b5563");
        
        let genderSymbol = "";
        if (person.Gender === "m") genderSymbol = "♂";
        else if (person.Gender === "w") genderSymbol = "♀";
        else if (person.Gender === "d") genderSymbol = "⚧";
        
        let details = genderSymbol ? `${genderSymbol} / ` : "";
        details += `Gen ${gen}`;
        if (person.Birth) details += ` / ${person.Birth}`;
        detailsText.textContent = details;
        personGroup.appendChild(detailsText);

        personGroup.addEventListener("dblclick", () => openEdit(person.Code));
        personGroup.addEventListener("mouseenter", function() {
            rect.setAttribute("stroke-width", "3");
            rect.setAttribute("filter", "url(#dropShadow)");
        });
        personGroup.addEventListener("mouseleave", function() {
            rect.setAttribute("stroke-width", "2");
            rect.setAttribute("filter", "none");
        });

        nodesGroup.appendChild(personGroup);
    });

    // Verbindungslinien
    const connectionsGroup = document.createElementNS(svgNS, "g");
    connectionsGroup.setAttribute("class", "connections");
    svg.appendChild(connectionsGroup);

    people.forEach(person => {
        if (person.ParentCode) {
            const parent = positions.get(person.ParentCode);
            const child = positions.get(person.Code);
            if (parent && child) {
                const verticalLine = document.createElementNS(svgNS, "line");
                verticalLine.setAttribute("x1", parent.x);
                verticalLine.setAttribute("y1", parent.y + boxHeight);
                verticalLine.setAttribute("x2", parent.x);
                verticalLine.setAttribute("y2", child.y - 15);
                verticalLine.setAttribute("stroke", "#6b7280");
                verticalLine.setAttribute("stroke-width", "2");
                connectionsGroup.appendChild(verticalLine);
                
                const horizontalLine = document.createElementNS(svgNS, "line");
                horizontalLine.setAttribute("x1", parent.x);
                horizontalLine.setAttribute("y1", child.y - 15);
                horizontalLine.setAttribute("x2", child.x);
                horizontalLine.setAttribute("y2", child.y - 15);
                horizontalLine.setAttribute("stroke", "#6b7280");
                horizontalLine.setAttribute("stroke-width", "2");
                connectionsGroup.appendChild(horizontalLine);
                
                const verticalConnector = document.createElementNS(svgNS, "line");
                verticalConnector.setAttribute("x1", child.x);
                verticalConnector.setAttribute("y1", child.y - 15);
                verticalConnector.setAttribute("x2", child.x);
                verticalConnector.setAttribute("y2", child.y);
                verticalConnector.setAttribute("stroke", "#6b7280");
                verticalConnector.setAttribute("stroke-width", "2");
                connectionsGroup.appendChild(verticalConnector);
            }
        }
    });

    partnerGroups.forEach((partnerCodes) => {
        const partner1 = positions.get(partnerCodes[0]);
        const partner2 = positions.get(partnerCodes[1]);
        
        if (partner1 && partner2 && Math.abs(partner1.y - partner2.y) < 10) {
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", partner1.x + boxWidth/2);
            line.setAttribute("y1", partner1.y + boxHeight/2);
            line.setAttribute("x2", partner2.x - boxWidth/2);
            line.setAttribute("y2", partner2.y + boxHeight/2);
            line.setAttribute("stroke", "#dc2626");
            line.setAttribute("stroke-width", "3");
            connectionsGroup.appendChild(line);
        }
    });

    // Generationen-Beschriftung mit größerer Schrift
    generations.forEach((gen, genIndex) => {
        const y = 160 + genIndex * verticalSpacing - 20;
        
        const labelText = document.createElementNS(svgNS, "text");
        labelText.setAttribute("x", "40");
        labelText.setAttribute("y", y);
        labelText.setAttribute("font-size", "30");
        labelText.setAttribute("font-weight", "bold");
        labelText.setAttribute("fill", "#374151");
        labelText.setAttribute("text-anchor", "start");
        
        switch(gen) {
            case "1": labelText.textContent = "Stammeltern"; break;
            case "2": labelText.textContent = "Kinder"; break;
            case "3": labelText.textContent = "Enkel"; break;
            case "4": labelText.textContent = "Urenkel"; break;
            default: labelText.textContent = `Generation ${gen}`;
        }
        
        svg.appendChild(labelText);
    });

    // SVG-Filter
    const defs = document.createElementNS(svgNS, "defs");
    const filter = document.createElementNS(svgNS, "filter");
    filter.setAttribute("id", "dropShadow");
    filter.setAttribute("height", "130%");
    
    const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
    feGaussianBlur.setAttribute("in", "SourceAlpha");
    feGaussianBlur.setAttribute("stdDeviation", "2");
    filter.appendChild(feGaussianBlur);
    
    const feOffset = document.createElementNS(svgNS, "feOffset");
    feOffset.setAttribute("dx", "3");
    feOffset.setAttribute("dy", "3");
    feOffset.setAttribute("result", "offsetblur");
    filter.appendChild(feOffset);
    
    const feFlood = document.createElementNS(svgNS, "feFlood");
    feFlood.setAttribute("flood-color", "rgba(0,0,0,0.2)");
    filter.appendChild(feFlood);
    
    const feComposite = document.createElementNS(svgNS, "feComposite");
    feComposite.setAttribute("in2", "offsetblur");
    feComposite.setAttribute("operator", "in");
    filter.appendChild(feComposite);
    
    const feMerge = document.createElementNS(svgNS, "feMerge");
    const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
    const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
    feMergeNode2.setAttribute("in", "SourceGraphic");
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    
    defs.appendChild(filter);
    svg.appendChild(defs);

    setTimeout(() => {
        try {
            const bbox = svg.getBBox();
            const padding = 100;
            svg.setAttribute("viewBox", 
                `${bbox.x - padding} ${bbox.y - padding} 
                 ${bbox.width + 2 * padding} ${bbox.height + 2 * padding}`
            );
        } catch (e) {
            console.log("Viewport-Anpassung nicht möglich:", e);
        }
    }, 100);
}

/* CRUD Funktionen */
function normalizePersonCode(code){
  if(!code) return "";
  let s = String(code).trim();
  if(s.endsWith('x') || s.endsWith('X')) {
    s = s.slice(0, -1).toUpperCase() + 'x';
  } else {
    s = s.toUpperCase();
  }
  return s;
}

function nextChildCode(parent){
  const kids = people.filter(p=>p.ParentCode===parent && p.Code.startsWith(parent));
  const nums = kids.map(k=> {
    const numPart = k.Code.replace(parent, "").replace(/x$/, "");
    return parseInt(numPart, 10);
  }).filter(n=>!isNaN(n));
  let next=1; while(nums.includes(next)) next++;
  return parent + String(next);
}

function openNew(){
  $("#pName").value=""; $("#pBirth").value=""; $("#pPlace").value="";
  $("#pGender").value=""; $("#pParent").value=""; $("#pPartner").value=""; $("#pInherited").value=""; $("#pNote").value="";
  $("#dlgNew").showModal();
}

function addNew(){
  const name=$("#pName").value.trim();
  const birth=$("#pBirth").value.trim();
  const place=$("#pPlace").value.trim();
  const gender=$("#pGender").value;
  const parent=normalizePersonCode($("#pParent").value.trim());
  const partner=normalizePersonCode($("#pPartner").value.trim());
  const inherited=normalizePersonCode($("#pInherited").value.trim());
  const note=$("#pNote").value.trim();

  if (!name || !birth || !place || !gender || !parent) {
    alert("Bitte füllen Sie alle Pflichtfelder aus");
    return;
  }

  if (!validateBirthDate(birth)) {
    alert("Ungültiges Geburtsdatum-Format. Bitte verwenden Sie TT.MM.JJJJ");
    $("#pBirth").value = "";
    return;
  }

  let gen=1, code="";
  if(parent){
    const parentP = people.find(p=>p.Code===parent);
    gen = parentP ? (parentP.Gen||1)+1 : 2;
    code = nextChildCode(parent);
  }else{
    code = partner==="1" ? "1x" : "1";
  }
  
  const p={Gen:gen, Code:code, Name:name, Birth:birth, BirthPlace:place, Gender:gender, 
           ParentCode:parent, PartnerCode:partner, InheritedFrom:inherited, Note:note};
  people.push(p);
  saveState(); 
  renderTable(); 
  renderTree();
  $("#dlgNew").close();
}

let editCode=null;
function openEdit(code){
  const p=people.find(x=>x.Code===code); 
  if(!p) return;
  editCode=code;
  $("#eName").value=p.Name||""; 
  $("#eBirth").value=p.Birth||""; 
  $("#ePlace").value=p.BirthPlace||"";
  $("#eGender").value=p.Gender||""; 
  $("#eParent").value=p.ParentCode||""; 
  $("#ePartner").value=p.PartnerCode||"";
  $("#eInherited").value=p.InheritedFrom||""; 
  $("#eNote").value=p.Note||"";
  $("#dlgEdit").showModal();
}

function saveEditFn(){
  const p=people.find(x=>x.Code===editCode); 
  if(!p) return;
  
  const name=$("#eName").value.trim();
  const birth=$("#eBirth").value.trim();
  const place=$("#ePlace").value.trim();
  const gender=$("#eGender").value;
  const parent=normalizePersonCode($("#eParent").value.trim());
  
  if (!name || !birth || !place || !gender || !parent) {
    alert("Bitte füllen Sie alle Pflichtfelder aus");
    return;
  }

  if (!validateBirthDate(birth)) {
    alert("Ungültiges Geburtsdatum-Format. Bitte verwenden Sie TT.MM.JJJJ");
    $("#eBirth").value = "";
    return;
  }

  p.Name=name;
  p.Birth=birth;
  p.BirthPlace=place;
  p.Gender=gender;
  p.ParentCode=parent;
  p.PartnerCode=normalizePersonCode($("#ePartner").value.trim());
  p.InheritedFrom=normalizePersonCode($("#eInherited").value.trim());
  p.Note=$("#eNote").value.trim();
  
  p.Gen = computeGenFromCode(p.Code);
  saveState(); 
  renderTable(); 
  renderTree();
  $("#dlgEdit").close();
}

function deletePerson(){
  const id = prompt("Bitte Namen oder Personen-Code der zu löschenden Person eingeben:");
  if(!id) return;
  const idx = people.findIndex(p=> p.Code===id || (p.Name||"").toLowerCase()===id.toLowerCase());
  if(idx<0){ alert("Person nicht gefunden."); return; }
  const code = people[idx].Code;
  people.splice(idx,1);
  people.forEach(p=>{
    if(p.ParentCode===code) p.ParentCode="";
    if(p.PartnerCode===code) p.PartnerCode="";
    if(p.InheritedFrom===code) p.InheritedFrom="";
  });
  saveState(); 
  renderTable(); 
  renderTree();
}

/* Import */
function doImport(file){
  const r=new FileReader();
  r.onload=()=>{
    try{
      let data;
      if(file.name.toLowerCase().endsWith('.csv')) {
        data = parseCSV(r.result);
      } else {
        data = JSON.parse(r.result);
      }
      
      if(!Array.isArray(data)) throw new Error("Format");
      
      const validData = [];
      let hasErrors = false;
      
      for (const item of data) {
        if (item && typeof item === 'object' && item.Code && typeof item.Code === 'string') {
          if (!validateRequiredFields(item) || (item.Birth && !validateBirthDate(item.Birth))) {
            hasErrors = true;
            break;
          }
          validData.push(item);
        }
      }
      
      if (hasErrors || validData.length === 0) {
        $("#dlgImportError").showModal();
        return;
      }
      
      people = validData;
      postLoadFixups();
      saveState(false);
      renderTable(); 
      renderTree();
    }catch(e){ 
      console.error("Import error:", e);
      $("#dlgImportError").showModal();
    }
  };
  r.readAsText(file);
}

function parseCSV(csvText) {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(';').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';').map(v => v.trim());
    const obj = {};
    
    for (let j = 0; j < headers.length; j++) {
      if (j < values.length) {
        obj[headers[j]] = values[j] || '';
      }
    }
    
    if (obj.Code) {
      result.push(obj);
    }
  }
  return result;
}

/* Export Funktionen */
function exportJSON(){
  const blob = new Blob([JSON.stringify(people,null,2)],{type:"application/json"});
  shareOrDownload("familie.json", blob);
}

function exportCSV(){
  const cols=["Gen","Code","RingCode","Name","Birth","BirthPlace","Gender","ParentCode","PartnerCode","InheritedFrom","Note"];
  const lines=[cols.join(";")];
  for(const p of people){ 
    lines.push(cols.map(c=> {
      const value = p[c] ?? "";
      return String(value).replace(/;/g, ",").replace(/\n/g, " ");
    }).join(";")); 
  }
  const blob = new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"});
  shareOrDownload("familie.csv", blob);
}

async function shareOrDownload(filename, blob){
  try {
    if(navigator.canShare && navigator.canShare({ files: [] })) {
      const file = new File([blob], filename, { type: blob.type });
      await navigator.share({ files: [file], title: "Export" });
      return;
    }
  } catch(e) { }
  
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }, 100);
}

function printTable(){
  $("#dlgPrint").close();
  const tableHTML = document.getElementById('peopleTable').outerHTML;
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wappenringe der Familie GEPPERT - Tabelle</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Wappenringe der Familie GEPPERT - Tabelle</h1>
        ${tableHTML}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

function printTree(){
  $("#dlgPrint").close();
  const treeContainer = document.getElementById('tree').cloneNode(true);
  treeContainer.style.width = "100%";
  treeContainer.style.height = "auto";
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Wappenringe der Familie GEPPERT - Stammbaum</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          svg { width: 100%; height: auto; }
        </style>
      </head>
      <body>
        <h1>Wappenringe der Familie GEPPERT - Stammbaum</h1>
        <div style="width: 100%">${treeContainer.outerHTML}</div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}

/* Stats */
function updateStats(){
  let total=0, m=0, w=0, d=0; 
  const byGen={};
  
  for(const p of people){
    total++;
    const g = (p.Gender||"").toLowerCase();
    if(g==="m") m++; 
    else if(g==="w") w++; 
    else if(g==="d") d++;
    byGen[p.Gen] = (byGen[p.Gen]||0)+1;
  }
  
  let html = `<p>Gesamtanzahl Personen: <b>${total}</b></p>`;
  html += `<p>davon männlich: <b>${m}</b> — weiblich: <b>${w}</b> — divers: <b>${d}</b></p>`;
  html += `<ul>`; 
  Object.keys(byGen).sort((a,b)=>a-b).forEach(k=> html += `<li>Generation ${k}: ${byGen[k]}</li>`); 
  html += `</ul>`;
  $("#statsContent").innerHTML = html;
}

/* Events */
function setupEventListeners() {
  // Haupt-Buttons
  $("#btnNew").addEventListener("click", openNew);
  $("#btnDelete").addEventListener("click", deletePerson);
  $("#btnImport").addEventListener("click", handleImport);
  $("#btnExport").addEventListener("click", () => $("#dlgExport").showModal());
  $("#btnPrint").addEventListener("click", () => $("#dlgPrint").showModal());
  $("#btnStats").addEventListener("click", showStats);
  $("#btnHelp").addEventListener("click", showHelp);
  $("#btnReset").addEventListener("click", resetData);
  $("#btnUndo").addEventListener("click", undo);
  $("#btnRedo").addEventListener("click", redo);
  
  // Dialog-Buttons
  $("#saveNew").addEventListener("click", (e) => { e.preventDefault(); addNew(); });
  $("#saveEdit").addEventListener("click", (e) => { e.preventDefault(); saveEditFn(); });
  $("#btnExportJSON").addEventListener("click", () => { exportJSON(); $("#dlgExport").close(); });
  $("#btnExportCSV").addEventListener("click", () => { exportCSV(); $("#dlgExport").close(); });
  $("#btnPrintTable").addEventListener("click", () => { printTable(); $("#dlgPrint").close(); });
  $("#btnPrintTree").addEventListener("click", () => { printTree(); $("#dlgPrint").close(); });
  
  // Suche
  $("#search").addEventListener("input", renderTable);
  
  // Datumsvalidierung
  $("#pBirth").addEventListener("blur", validateDateField);
  $("#eBirth").addEventListener("blur", validateDateField);
}

function handleImport() {
  const inp = document.createElement("input"); 
  inp.type = "file"; 
  inp.accept = ".json,.csv,application/json,text/csv"; 
  inp.onchange = () => { if(inp.files[0]) doImport(inp.files[0]); }; 
  inp.click();
}

function validateDateField(e) {
  if (e.target.value && !validateBirthDate(e.target.value)) {
    alert("Ungültiges Geburtsdatum-Format. Bitte verwenden Sie TT.MM.JJJJ (z.B. 04.12.2000)");
    e.target.value = "";
    e.target.focus();
  }
}

function showStats() {
  updateStats(); 
  $("#dlgStats").showModal();
}

function showHelp() {
  $("#helpContent").innerHTML = "<p>Hilfedatei wird geladen...</p>";
  $("#dlgHelp").showModal();
  fetch("help.html")
    .then(r => r.text())
    .then(html => { 
      $("#helpContent").innerHTML = html; 
    })
    .catch(() => {
      $("#helpContent").innerHTML = "<p>Hilfedatei konnte nicht geladen werden.</p>";
    });
}

function resetData() {
  if(confirm("Sollen wirklich alle Personen gelöscht werden?")){ 
    people = []; 
    saveState(); 
    renderTable(); 
    renderTree(); 
  }
}

function undo() {
  if(!undoStack.length) return; 
  redoStack.push(JSON.stringify(people)); 
  people = JSON.parse(undoStack.pop()); 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people)); 
  renderTable(); 
  renderTree(); 
}

function redo() {
  if(!redoStack.length) return; 
  undoStack.push(JSON.stringify(people)); 
  people = JSON.parse(redoStack.pop()); 
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people)); 
  renderTable(); 
  renderTree(); 
}

/* Init */
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  loadState(); 
  renderTable(); 
  renderTree();
});
