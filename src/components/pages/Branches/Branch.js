import "./Branch.css";
import * as React from "react";
import Topbar from "../../topbar/Topbar";
import Sidebar from "../../sidebar/Sidebar";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Checkbox,
  TextField,
} from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Styles for modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const skus = {
  V1: [
    {
      SKUDescription: "KOPIKO COFFEE CANDY 24X175G",
      product: "COFFEE SHOT",
      skuCode: "326924",
    },
    {
      SKUDescription: "KOPIKO COFFEE CANDY JAR 6X560G",
      product: "COFFEE SHOT",
      skuCode: "326926",
    },
    {
      SKUDescription: "KOPIKO CAPPUCCINO CANDY 24X175G",
      product: "COFFEE SHOT",
      skuCode: "326925",
    },
    {
      SKUDescription: "FRES BARLEY MINT 24X50X3G",
      product: "FRES",
      skuCode: "326446",
    },
    {
      SKUDescription: "FRES MINT BARLEY JAR 12X2003G",
      product: "FRES",
      skuCode: "329136",
    },
    {
      SKUDescription: "FRES MINT BARLEY CANDY BIGPACK 6X1350G",
      product: "FRES",
      skuCode: "",
    },
    {
      SKUDescription: "FRES CHERRY CANDY, 24 X 50 X 3G",
      product: "FRES",
      skuCode: "326447",
    },
    {
      SKUDescription: "FRES CHERRY JAR, 12X 200 X 3G",
      product: "FRES",
      skuCode: "329135",
    },
    {
      SKUDescription: "FRES MINT CHERRY CANDY BIGPACK 6X1350G",
      product: "FRES",
      skuCode: "",
    },
    {
      SKUDescription: "CAL CHEESE 10X20X8.5G",
      product: "CAL CHEESE",
      skuCode: "329809",
    },
    {
      SKUDescription: "CAL CHEESE 60X35G",
      product: "CAL CHEESE",
      skuCode: "322571",
    },
    {
      SKUDescription: "CAL CHEESE 60X53.5G",
      product: "CAL CHEESE",
      skuCode: "329808",
    },
    {
      SKUDescription: "CAL CHEESE CHEESE CHOCO 60X53.5G",
      product: "CAL CHEESE",
      skuCode: "322866",
    },
    {
      SKUDescription: "CAL CHEESE CHEESE CHOCO 60X35G",
      product: "CAL CHEESE",
      skuCode: "322867",
    },
    {
      SKUDescription: "MALKIST CHOCOLATE 30X10X24G",
      product: "MALKIST",
      skuCode: "321036",
    },
    { SKUDescription: "ROMA CREAM CRACKERS", product: "ROMA", skuCode: "" },
    {
      SKUDescription: "WAFELLO CHOCOLATE WAFER 60X53.5G",
      product: "WAFELLO",
      skuCode: "330016",
    },
    {
      SKUDescription: "WAFELLO CHOCOLATE WAFER 60X35G",
      product: "WAFELLO",
      skuCode: "330025",
    },
    {
      SKUDescription: "WAFELLO BUTTER CARAMEL 60X35G",
      product: "WAFELLO",
      skuCode: "322871",
    },
    {
      SKUDescription: "WAFELLO COCO CREME 60X35G",
      product: "WAFELLO",
      skuCode: "322868",
    },
    {
      SKUDescription: "WAFELLO CREAMY VANILLA 20X10X20.5G PH",
      product: "WAFELLO",
      skuCode: "330073",
    },
    {
      SKUDescription: "VALMER CHOCOLATE 12X10X54G",
      product: "VALMER",
      skuCode: "321038",
    },
    {
      SKUDescription: "SUPERSTAR TRIPLE CHOCOLATE 12 X10 X 18G",
      product: "SUPERSTAR",
      skuCode: "322894",
    },
    {
      SKUDescription: "DANISA BUTTER COOKIES 12X454G",
      product: "DANISA",
      skuCode: "329650",
    },
    {
      SKUDescription: "WAFELLO BUTTER CARAMEL 60X53.5G",
      product: "WAFELLO",
      skuCode: "322870",
    },
    {
      SKUDescription: "WAFELLO COCO CREME 60X53.5G",
      product: "WAFELLO",
      skuCode: "322869",
    },
    {
      SKUDescription: "WAFELLO CREAMY VANILLA 60X48G PH",
      product: "WAFELLO",
      skuCode: "330060",
    },
    {
      SKUDescription: "WAFELLO CHOCOLATE 48G X 60",
      product: "WAFELLO",
      skuCode: "330050",
    },
    {
      SKUDescription: "WAFELLO CHOCOLATE 21G X 10 X 20",
      product: "WAFELLO",
      skuCode: "330051",
    },
    {
      SKUDescription: "WAFELLO BUTTER CARAMEL 48G X 60",
      product: "WAFELLO",
      skuCode: "330056",
    },
    {
      SKUDescription: "WAFELLO BUTTER CARAMEL 20.5G X 10 X 20",
      product: "WAFELLO",
      skuCode: "330057",
    },
    {
      SKUDescription: "WAFELLO COCO CRÈME 48G X 60",
      product: "WAFELLO",
      skuCode: "330058",
    },
    {
      SKUDescription: "WAFELLO COCONUT CRÈME 20.5G X 10 X 20",
      product: "WAFELLO",
      skuCode: "330059",
    },
    {
      SKUDescription: "CAL CHEESE 60 X 48G",
      product: "CAL CHEESE",
      skuCode: "330052",
    },
    {
      SKUDescription: "CAL CHEESE 20 X 10 X 20G",
      product: "CAL CHEESE",
      skuCode: "330053",
    },
    {
      SKUDescription: "CAL CHEESE 20 X 20 X 8.5G",
      product: "CAL CHEESE",
      skuCode: "330071",
    },
    {
      SKUDescription: "CAL CHEESE CHOCO 60 X 48G",
      product: "CAL CHEESE",
      skuCode: "330054",
    },
    {
      SKUDescription: "CAL CHEESE CHOCO 20 X 10 X 20.5G",
      product: "CAL CHEESE",
      skuCode: "330055",
    },
    {
      SKUDescription: "VALMER SANDWICH CHOCOLATE 12X10X36G",
      product: "VALMER",
      skuCode: "321475",
    },
    {
      SKUDescription: "MALKIST CAPPUCCINO 30X10X23G PH",
      product: "MALKIST",
      skuCode: "321446",
    },
  ],
  V2: [
    {
      SKUDescription: "KOPIKO BLACK 3 IN ONE HANGER 24 X 10 X 30G",
      product: "BLACK",
      skuCode: "322628",
    },
    {
      SKUDescription: "KOPIKO BLACK 3 IN ONE POUCH 24 X 10 X 30G",
      product: "BLACK",
      skuCode: "322630",
    },
    {
      SKUDescription: "KOPIKO BLACK 3 IN ONE BAG 8 X 30 X 30G",
      product: "BLACK",
      skuCode: "322629",
    },
    {
      SKUDescription: "KOPIKO BLACK 3 IN ONE PROMO TWIN 12 X 10 X 2 X 30G",
      product: "BLACK",
      skuCode: "322627",
    },
    {
      SKUDescription: "KOPIKO BROWN COFFEE HG 27.5G 24 X 10 X 27.5G",
      product: "BROWN",
      skuCode: "328890",
    },
    {
      SKUDescription: "KOPIKO BROWN COFFEE POUCH 24 X 10 X 27.GG",
      product: "BROWN",
      skuCode: "329958",
    },
    {
      SKUDescription: "KOPIKO BROWN COFFEE BAG 8 X 30 X 27.5G",
      product: "BROWN",
      skuCode: "329959",
    },
    {
      SKUDescription: "KOPIKO BROWN PROMO TWIN 12 X 10 X 53G",
      product: "BROWN",
      skuCode: "329940",
    },
    {
      SKUDescription: "KOPIKO CAPPUCCINO HANGER 24 X 10 X 25G",
      product: "CAPPUCCINO",
      skuCode: "329701",
    },
    {
      SKUDescription: "KOPIKO CAPPUCCINO POUCH 24 X 10 X 25G",
      product: "CAPPUCCINO",
      skuCode: "329703",
    },
    {
      SKUDescription: "KOPIKO CAPPUCCINO BAG 8 X 30 X 25G",
      product: "CAPPUCCINO",
      skuCode: "329704",
    },
    {
      SKUDescription: "KOPIKO L.A. COFFEE HANGER 24 X 10 X 25G",
      product: "L.A.",
      skuCode: "325666",
    },
    {
      SKUDescription: "KOPIKO L.A. COFFEE POUCH 24 X 10 X 25G",
      product: "L.A.",
      skuCode: "325667",
    },
    {
      SKUDescription: "KOPIKO BLANCA HANGER 24 X 10 X 30G",
      product: "BLANCA",
      skuCode: "328888",
    },
    {
      SKUDescription: "KOPIKO BLANCA POUCH 24 X 10 X 30G",
      product: "BLANCA",
      skuCode: "328887",
    },
    {
      SKUDescription: "KOPIKO BLANCA BAG 8 X 30 X 30G",
      product: "BLANCA",
      skuCode: "328889",
    },
    {
      SKUDescription: "KOPIKO BLANCA TWINPACK 12 X 10 X 2 X 29G",
      product: "BLANCA",
      skuCode: "322711",
    },
    {
      SKUDescription: "TORACAFE WHITE AND CREAMY 12 X (10 X 2) X 26G",
      product: "TORA",
      skuCode: "322731",
    },
    {
      SKUDescription: "KOPIKO CREAMY CARAMELO 12 X (10 X 2) X 25G",
      product: "CARAMELO",
      skuCode: "322725",
    },
    {
      SKUDescription: "KOPIKO DOUBLE CUPS 24 X 10 X 36G",
      product: "DOUBLE CUPS",
      skuCode: "329744",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE HANGER 24 X 10 X 40G",
      product: "ENERGEN",
      skuCode: "328497",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE POUCH 24 X 10 X 40G",
      product: "ENERGEN",
      skuCode: "328492",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE BAG 8 X 30 X 40G",
      product: "ENERGEN",
      skuCode: "328493",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE VANILLA HANGER 24 X 10 X 40G",
      product: "ENERGEN",
      skuCode: "328494",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE VANILLA POUCH 24 X 10 X 40G",
      product: "ENERGEN",
      skuCode: "328495",
    },
    {
      SKUDescription: "ENERGEN CHOCOLATE VANILLA BAG 8 X 30 X 40G",
      product: "ENERGEN",
      skuCode: "328496",
    },
    {
      SKUDescription: "ENERGEN CHAMPION NBA HANGER 24 X 10 X 35G",
      product: "CHAMPION",
      skuCode: "325945",
    },
    {
      SKUDescription: "ENERGEN PADESAL MATE 24 X 10 X 30G",
      product: "EPM",
      skuCode: "325920",
    },
    {
      SKUDescription: "ENERGEN CHAMPION 12 X 10 X 2 X 35G PH",
      product: "CHAMPION",
      skuCode: "325944",
    },
    {
      SKUDescription: "KOPIKO CAFE MOCHA TP 12 X 10 X (2 X 25.5G) PH",
      product: "CAFÉ MOCHA",
      skuCode: "324149",
    },
    {
      SKUDescription: "ENERGEN CHAMPION NBA TP 15 X 8 X 2 X 30G PH",
      product: "CHAMPION",
      skuCode: "325965",
    },
    {
      SKUDescription:
        "BLACK 420011 KOPIKO BLACK 3IN1 TWINPACK 12 X 10 X 2 X 28G",
      product: "BLACK",
      skuCode: "420011",
    },
  ],
  V3: [
    {
      SKUDescription: "LE MINERALE 24x330ML",
      product: "WATER",
      skuCode: "328566",
    },
    {
      SKUDescription: "LE MINERALE 24x600ML",
      product: "WATER",
      skuCode: "328565",
    },
    {
      SKUDescription: "LE MINERALE 12x1500ML",
      product: "WATER",
      skuCode: "326770",
    },
    {
      SKUDescription: "LE MINERALE 4 X 5000ML",
      product: "WATER",
      skuCode: "324045",
    },
    {
      SKUDescription: "KOPIKO LUCKY DAY 24BTL X 180ML",
      product: "KLD",
      skuCode: "324046",
    },
  ],
};

export default function OUTLET() {
  const [branches, setBranches] = React.useState([
  "PUREGOLD PRICE CLUB - LA TRINIDAD BENGUET",
    "PUREGOLD PRICE CLUB - BAGUIO",
    "PUREGOLD PRICE CLUB - LAOAG",
    "PUREGOLD PRICE CLUB (JR.)- OLD CENTRO",
    "PUREGOLD PRICE CLUB - CONCEPCION TARLAC",
    "PUREGOLD PRICE CLUB - CABANATUAN",
    "PUREGOLD PRICE CLUB - ZARAGOZA",
    "PUREGOLD PRICE CLUB - GAPAN",
    "PUREGOLD PRICE CLUB - CAPAS",
    "PUREGOLD PRICE CLUB - CAUAYAN ISABELA",
    "PUREGOLD PRICE CLUB (JR.)- PALM PLAZA",
    "PUREGOLD PRICE CLUB - PANIQUI",
    "PUREGOLD PRICE CLUB - PUBLIC MARKET",
    "PUREGOLD PRICE CLUB - ROXAS ISABELA",
    "PUREGOLD PRICE CLUB - BALER (N.E)",
    "PUREGOLD PRICE CLUB - MARIA AURORA",
    "PUREGOLD PRICE CLUB - TUMAUINI",
    "PUREGOLD PRICE CLUB (EXTRA.)- TUGUEGARAO",
    "PUREGOLD PRICE CLUB - CENTRO SANTIAGO",
    "PUREGOLD PRICE CLUB - VICTORY NORTE SANTIAGO (N.E)",
    "PUREGOLD PRICE CLUB - VIGAN",
    "PUREGOLD PRICE CLUB - BURNHAM PARK",
    "PUREGOLD PRICE CLUB (JR.)- BAKAKENG",
    "PUREGOLD PRICE CLUB - LA UNION",
    "PUREGOLD PRICE CLUB - BACNOTAN",
    "PUREGOLD PRICE CLUB - CALASIAO",
    "PUREGOLD PRICE CLUB - MANAOAG",
    "PUREGOLD PRICE CLUB - SAN FABIAN",
    "PUREGOLD PRICE CLUB (JR.)- BONUAN",
    "PUREGOLD PRICE CLUB - MAYOMBO",
    "PUREGOLD PRICE CLUB (JR.)- BAYAMBANG",
    "PUREGOLD PRICE CLUB - VILLASIS",
    "PUREGOLD PRICE CLUB - TALAVERA",
    "PUREGOLD PRICE CLUB - SAN JOSE NUEVA ECIJA (N.E)",
    "PUREGOLD PRICE CLUB - ZULUETA (N.E)",
    "PUREGOLD PRICE CLUB - CABANATUAN PALENGKE (N.E)",
    "PUREGOLD PRICE CLUB - PACIFIC MALL (N.E)",
    "PUREGOLD PRICE CLUB - CIRCUMFERENCIAL (N.E)",
    "PUREGOLD PRICE CLUB - CROSSING (N.E)",
    "PUREGOLD PRICE CLUB - GUIMBA",
    "PUREGOLD PRICE CLUB - ILAGAN",
    "PUREGOLD PRICE CLUB - ALIBAGU",
    "PUREGOLD PRICE CLUB - APPARI",
    "PUREGOLD PRICE CLUB - LAL-LO",
    "PUREGOLD PRICE CLUB - TUAO",
    "PUREGOLD PRICE CLUB - SOLANA",
    "PUREGOLD PRICE CLUB - DAU",
    "PUREGOLD PRICE CLUB - DAU ACCESS ROAD",
    "PUREGOLD PRICE CLUB (JR.)- DON JUICO",
    "PUREGOLD PRICE CLUB - MABALACAT",
    "PUREGOLD PRICE CLUB - MAWAQUE",
    "PUREGOLD PRICE CLUB - ANGELES",
    "PUREGOLD PRICE CLUB (JR.)-BALIBAGO",
    "PUREGOLD PRICE CLUB - CENTRAL TOWN",
    "PUREGOLD PRICE CLUB - PANDAN",
    "PUREGOLD PRICE CLUB - SUBIC",
    "PUREGOLD PRICE CLUB - OLONGAPO",
    "PUREGOLD PRICE CLUB - CASTILLEJOS",
    "PUREGOLD PRICE CLUB -DUTY FREE",
    "PUREGOLD PRICE CLUB - FERTUNA",
    "PUREGOLD PRICE CLUB - MAGALANG PAMPANGA",
    "PUREGOLD PRICE CLUB - ANGELES - MAGALANG ROAD EPZA",
    "PUREGOLD PRICE CLUB - ARAYAT PAMPANGA",
    "PUREGOLD PRICE CLUB - MEXICO",
    "PUREGOLD PRICE CLUB -CANDABA",
    "PUREGOLD PRICE CLUB - DINALUPIHAN",
    "PUREGOLD PRICE CLUB (JR.)- ORANI",
    "PUREGOLD PRICE CLUB (JR.)- LUBAO",
    "PUREGOLD PRICE CLUB (JR.)- GUAGUA",
    "PUREGOLD PRICE CLUB (EXTRA.)- FLORIDA BLANCA",
    "PUREGOLD PRICE CLUB (JR.)- PORAC",
    "PUREGOLD PRICE CLUB - MASANTOL",
    "PUREGOLD PRICE CLUB (EXTRA.)- MACABEBE",
    "PUREGOLD PRICE CLUB (JR.)- STO.TOMAS",
    "PUREGOLD PRICE CLUB - SAN SIMON",
    "PUREGOLD PRICE CLUB - MARIVELES",
    "PUREGOLD PRICE CLUB - LIMAY",
    "PUREGOLD PRICE CLUB - BALANGA",
    "PUREGOLD PRICE CLUB (JR.)- ABUCAY",
    "PUREGOLD PRICE CLUB - IBA ZAMBALES",
    "ROYAL DUTY FREE 1",
    "ROYAL DUTY FREE 2",
    "PUREGOLD PRICE CLUB (JR.)- SF 2 CAFÉ FERNANDINO",
    "PUREGOLD PRICE CLUB - BULAON",
    "PUREGOLD PRICE CLUB (JR.)- SF 1 DOLORES",
    "PUREGOLD PRICE CLUB (EXTRA.)- APALIT",
    "PUREGOLD PRICE CLUB - TUNGKONG MANGGA",
    "PUREGOLD PRICE CLUB (JR.)- SAPANG PALAY, SAMPOL",
    "PUREGOLD PRICE CLUB - SAN JOSE DEL MONTE PALMERA",
    "PUREGOLD PRICE CLUB - MEYCAUAYAN BANGA",
    "PUREGOLD PRICE CLUB - MALANDAY",
    "PUREGOLD PRICE CLUB - OBANDO",
    "PUREGOLD PRICE CLUB - BALIWAG",
    "PUREGOLD PRICE CLUB - TANGOS BALIWAG",
    "PUREGOLD PRICE CLUB - DRT HI-WAY (N.E)",
    "PUREGOLD PRICE CLUB - HAGONOY BULACAN",
    "PUREGOLD PRICE CLUB - PAOMBONG",
    "PUREGOLD PRICE CLUB - TABANG GUIGUINTO",
    "PUREGOLD PRICE CLUB - MALOLOS",
    "PUREGOLD PRICE CLUB - SAN MIGUEL BULACAN",
    "PUREGOLD PRICE CLUB - SAN ILDEFONSO",
    "PUREGOLD PRICE CLUB - VALENZUELA-1",
    "PUREGOLD PRICE CLUB - ALIW",
    "PUREGOLD PRICE CLUB - MARILAO PLAZA CECILIA",
    "PUREGOLD PRICE CLUB (JR.)- CALVARIO",
    "PUREGOLD PRICE CLUB (JR.)- CAMALIG",
    "PUREGOLD PRICE CLUB (JR.)- KARUHATAN",
    "PUREGOLD PRICE CLUB (JR.)- MALINTA",
    "PUREGOLD PRICE CLUB - PLARIDEL",
    "PUREGOLD PRICE CLUB - MALOLOS JUNCTION",
    "PUREGOLD PRICE CLUB - GUINGUINTO BAYAN",
    "PUREGOLD PRICE CLUB - BULAKAN,BULAKAN",
    "PUREGOLD PRICE CLUB - STA.MARIA",
    "PUREGOLD PRICE CLUB (JR.)- PANDI",
    "PUREGOLD PRICE CLUB - BOCAUE",
    "PUREGOLD PRICE CLUB - CASA CECILIA",
    "PUREGOLD PRICE CLUB - LIAS MARILAO",
    "PUREGOLD PRICE CLUB (JR.)- LOMA DE GATO",
    "PUREGOLD PRICE CLUB - MUZON",
    "PUREGOLD PRICE CLUB - PASO DE BLAS",
    "PUREGOLD PRICE CLUB (JR.)- LIBERTAD",
    "PUREGOLD PRICE CLUB - LIBERTAD",
    "PUREGOLD PRICE CLUB - SUCAT",
    "PUREGOLD PRICE CLUB - MOONWALK",
    "PUREGOLD MINIMART - DONA SOLEDAD",
    "PUREGOLD PRICE CLUB - REMANVILLE",
    "PUREGOLD PRICE CLUB - SOUTHPARK",
    "PUREGOLD PRICE CLUB (JR.)- BF HOMES",
    "PUREGOLD PRICE CLUB - AGUIRRE",
    "PUREGOLD PRICE CLUB (JR.)- BETTER LIVING",
    "PUREGOLD PRICE CLUB (JR.)- DOROTEO JOSE",
    "PUREGOLD PRICE CLUB (JR.)- CARRIEDO",
    "PUREGOLD PRICE CLUB (JR.)- ESPANA",
    "PUREGOLD PRICE CLUB (JR.)- BUSTILLOS",
    "PUREGOLD PRICE CLUB - 999",
    "PUREGOLD PRICE CLUB (JR.)- JUAN LUNA",
    "PUREGOLD PRICE CLUB - DIVISORIA",
    "PUREGOLD PRICE CLUB - MALATE",
    "PUREGOLD PRICE CLUB - PACO",
    "PUREGOLD PRICE CLUB - PASIG",
    "PUREGOLD PRICE CLUB - TAGUIG",
    "PUREGOLD PRICE CLUB - PARANAQUE-1",
    "PUREGOLD PRICE CLUB (JR.)- BACLARAN",
    "PUREGOLD PRICE CLUB - MAKATI-1",
    "PUREGOLD PRICE CLUB (EXTRA.)- OSMENA",
    "PUREGOLD PRICE CLUB - SAN ANTONIO",
    "PUREGOLD PRICE CLUB - SAN DIONISIO",
    "PUREGOLD PRICE CLUB (JR.)- PANDACAN",
    "PUREGOLD PRICE CLUB (JR.)- BOCOBO",
    "PUREGOLD PRICE CLUB - FTI",
    "PUREGOLD PRICE CLUB (JR.)- TIPAS",
    "PUREGOLD PRICE CLUB (JR.)- USUSAN",
    "PUREGOLD PRICE CLUB (EXTRA.)- TAGUIG HAGONOY",
    "PUREGOLD PRICE CLUB - TAYUMAN-1",
    "PUREGOLD PRICE CLUB - GAGALANGIN",
    "PUREGOLD PRICE CLUB - DV HERBOSA",
    "PUREGOLD PRICE CLUB (JR.)- ZURBARAN",
    "PUREGOLD PRICE CLUB (JR.)- 3RD AVE",
    "PUREGOLD PRICE CLUB (JR.)- BLUMENTRITT CGH",
    "PUREGOLD PRICE CLUB - BLUMENTRITT",
    "PUREGOLD PRICE CLUB - SOUTHGATE",
    "PUREGOLD PRICE CLUB (JR.)- V. MAPA",
    "PUREGOLD PRICE CLUB (JR.)- PUREZA",
    "PUREGOLD PRICE CLUB - STA.MESA",
    "PUREGOLD PRICE CLUB - AGORA",
    "PUREGOLD PRICE CLUB - PULANG LUPA",
    "PUREGOLD PRICE CLUB - LAS PINAS",
    "PUREGOLD PRICE CLUB (JR.)- ZAPOTE ARCADE",
    "PUREGOLD PRICE CLUB - PULANG LUPA UNO",
    "PUREGOLD PRICE CLUB - MOLITO",
    "PUREGOLD PRICE CLUB - PUTATAN",
    "PUREGOLD PRICE CLUB - CASIMIRO",
    "PUREGOLD PRICE CLUB - MARCOS ALVAREZ LAS PINAS",
    "PUREGOLD PRICE CLUB - MINDANAO AVE",
    "PUREGOLD PRICE CLUB - COMMONWEALTH-1",
    "PUREGOLD PRICE CLUB - NORTH COMMONWEALTH",
    "PUREGOLD PRICE CLUB - CALOOCAN",
    "PUREGOLD PRICE CLUB - MONUMENTO",
    "PUREGOLD PRICE CLUB - BALINTAWAK",
    "PUREGOLD PRICE CLUB (JR.)- KALAYAAN",
    "PUREGOLD PRICE CLUB - KANLAON",
    "PUREGOLD PRICE CLUB (JR.)- DEL MONTE",
    "PUREGOLD PRICE CLUB (EXTRA.)- A. BONIFACIO",
    "PUREGOLD PRICE CLUB - MAYPAJO",
    "PUREGOLD PRICE CLUB - MALABON",
    "PUREGOLD PRICE CLUB - NAVOTAS",
    "PUREGOLD PRICE CLUB - CUBAO-1",
    "PUREGOLD PRICE CLUB - Q.I -1",
    "PUREGOLD PRICE CLUB (JR.)- MOTHER IGNACIA",
    "PUREGOLD PRICE CLUB (JR.)- TIMOG",
    "PUREGOLD PRICE CLUB - Q. AVE",
    "PUREGOLD PRICE CLUB (JR.)- WEST AVE.",
    "PUREGOLD PRICE CLUB (EXTRA)- PHILAM",
    "PUREGOLD PRICE CLUB (EXTRA.)- TANDANG SORA",
    "PUREGOLD PRICE CLUB - BAESA",
    "PUREGOLD PRICE CLUB - CROSSROAD",
    "PUREGOLD PRICE CLUB - LANGARAY",
    "PUREGOLD PRICE CLUB (MINIMART.)- LIBIS",
    "PUREGOLD PRICE CLUB - 999 CALOOCAN",
    "AYAGOLD UP TOWN",
    "AYAGOLD NORTH VERTIS",
    "PUREGOLD PRICE CLUB (JR.)- DON ANTONIO",
    "PUREGOLD PRICE CLUB - CULIAT",
    "PUREGOLD PRICE CLUB (JR.)- BALARA",
    "PUREGOLD PRICE CLUB - VISAYAS",
    "PUREGOLD PRICE CLUB (JR.)- QUIRINO HI WAY",
    "PUREGOLD PRICE CLUB - TERRACES",
    "PUREGOLD PRICE CLUB - ZABARTE",
    "PUREGOLD PRICE CLUB - SUSANO",
    "PUREGOLD PRICE CLUB - NITANG",
    "PUREGOLD PRICE CLUB - BAGONG SILANG",
    "PUREGOLD PRICE CLUB - DEPARO",
    "PUREGOLD PRICE CLUB - LANGIT ROAD",
    "PUREGOLD PRICE CLUB - NOVALICHES",
    "PUREGOLD PRICE CLUB (JR.)- ZABARTE",
    "PUREGOLD PRICE CLUB - CAMARIN",
    "PUREGOLD PRICE CLUB - CHAMPACA",
    "PUREGOLD PRICE CLUB -SUPERPALENGKE, ANTIPOLO (G)",
    "PUREGOLD PRICE CLUB - AMPID SAN MATEO (G)",
    "PUREGOLD PRICE CLUB (EXTRA.)- AMPID",
    "PUREGOLD PRICE CLUB (EXTRA.)- GUITNANG BAYAN",
    "PUREGOLD PRICE CLUB - SAN RAFAEL",
    "PUREGOLD PRICE CLUB (JR.)- DULONG BAYAN SAN MATEO",
    "PUREGOLD PRICE CLUB - BURGOS",
    "PUREGOLD PRICE CLUB (JR.)- ROSARIO",
    "PUREGOLD PRICE CLUB (JR.)- DE CASTRO",
    "PUREGOLD PRICE CLUB - CONCEPCION",
    "PUREGOLD PRICE CLUB (JR.)- MARIKINA",
    "PUREGOLD PRICE CLUB - TAYTAY",
    "PUREGOLD PRICE CLUB - Q. PLAZA",
    "PUREGOLD PRICE CLUB - JUNCTION",
    "PUREGOLD PRICE CLUB - BINANGONAN",
    "PUREGOLD PRICE CLUB - TAYTAY -2",
    "PUREGOLD PRICE CLUB (JR.)- TAYTAY PALENGKE",
    "PUREGOLD PRICE CLUB (JR.)- TAYTAY ANNEX",
    "PUREGOLD PRICE CLUB - SUMULONG",
    "PUREGOLD PRICE CLUB (JR.)- LILAC",
    "PUREGOLD PRICE CLUB (EXTRA.)- PANORAMA",
    "PUREGOLD PRICE CLUB - AYALA MALL MARIKINA",
    "PUREGOLD PRICE CLUB (EXTRA.)- PARANG",
    "PUREGOLD PRICE CLUB (JR.)- CONCEPCION",
    "PUREGOLD PRICE CLUB (EXTRA.)- STA. ELENA",
    "PUREGOLD PRICE CLUB - ORTIGAS AVE EXT PASIG (G)",
    "PUREGOLD PRICE CLUB - LIGAYA",
    "PUREGOLD PRICE CLUB (JR.)- ORTIGAS EXT EAST SUMMIT",
    "PUREGOLD PRICE CLUB (EXTRA) - BROOKSIDE CAINTA",
    "PUREGOLD PRICE CLUB (JR.)- PAROLA",
    "PUREGOLD PRICE CLUB - TAYTAY FLOODWAY",
    "PUREGOLD PRICE CLUB - MONTALBAN",
    "PUREGOLD PRICE CLUB - SAN MATEO BANABA",
    "PUREGOLD PRICE CLUB - ANGONO",
    "PUREGOLD PRICE CLUB (EXTRA.)- ANGONO HIGH WAY",
    "PUREGOLD PRICE CLUB (EXTRA.)- ANGONO BAYAN",
    "PUREGOLD PRICE CLUB - TANAY",
    "PUREGOLD PRICE CLUB - ANTIPOLO",
    "PUREGOLD PRICE CLUB (JR.)- ANTIPOLO",
    "PUREGOLD PRICE CLUB - EXTRA COGEO",
    "PUREGOLD PRICE CLUB - EASTLAND",
    "PUREGOLD PRICE CLUB - CIRCUMFERENTIAL ROAD",
    "PUREGOLD PRICE CLUB - TERESA",
    "PUREGOLD PRICE CLUB - C. RAYMUNDO",
    "PUREGOLD PRICE CLUB (JR.)- MALINAO PASIG",
    "PUREGOLD PRICE CLUB (JR.)- MERCEDEZ",
    "PUREGOLD PRICE CLUB (JR.)- NANGKA",
    "PUREGOLD PRICE CLUB (JR.)- BATASAN",
    "PUREGOLD PRICE CLUB - KALENTONG",
    "PUREGOLD PRICE CLUB - SHAW",
    "PUREGOLD PRICE CLUB - STA.ROSA BALIBAGO",
    "PUREGOLD PRICE CLUB - VICTORY MALL",
    "PUREGOLD PRICE CLUB - TAGAPO",
    "PUREGOLD PRICE CLUB - SAN PABLO",
    "PUREGOLD PRICE CLUB - STA. CRUZ (G)",
    "PUREGOLD PRICE CLUB - VICTORIA LAGUNA",
    "PUREGOLD PRICE CLUB (MINIMART.)- PILA",
    "PUREGOLD PRICE CLUB - HALANG",
    "PUREGOLD PRICE CLUB - PAGSANJAN",
    "PUREGOLD PRICE CLUB - FAMY",
    "PUREGOLD PRICE CLUB - STA.ROSA BAYAN (G)",
    "PUREGOLD PRICE CLUB - ALAMINOS",
    "PUREGOLD PRICE CLUB - ROXAS MINDORO",
    "PUREGOLD PRICE CLUB - PACITA",
    "PUREGOLD PRICE CLUB (MINIMART.)- VILLA OLYMPIA",
    "PUREGOLD PRICE CLUB (MINIMART.)- MAGSAYSAY",
    "PUREGOLD PRICE CLUB - BINAN",
    "PUREGOLD PRICE CLUB (EXTRA.)- GOLDEN CITY",
    "PUREGOLD PRICE CLUB (JR.)- CROSSTOWN",
    "PUREGOLD PRICE CLUB (JR.)- LOS BANOS",
    "PUREGOLD PRICE CLUB (EXTRA.)- LOS BANOS",
    "PUREGOLD PRICE CLUB (JR.)- PARIAN",
    "PUREGOLD PRICE CLUB - SAN ISIDRO CABUYAO",
    "PUREGOLD PRICE CLUB (JR.)- CANLUBANG",
    "PUREGOLD PRICE CLUB (EXTRA.)- CANLUBANG",
    "PUREGOLD PRICE CLUB (EXTRA.)- MAMATID",
    "PUREGOLD PRICE CLUB (EXTRA.)- CABUYAO BANLIC",
    "PUREGOLD PRICE CLUB - CROSSING CALAMBA",
    "PUREGOLD PRICE CLUB - CALAMBA BAYAN",
    "PUREGOLD PRICE CLUB - CALIHAN HIGHWAY",
    "PUREGOLD PRICE CLUB (EXTRA.)- SAN PABLO",
    "PUREGOLD PRICE CLUB - CANDELARIA",
    "PUREGOLD PRICE CLUB (EXTRA.)- TIAONG",
    "PUREGOLD PRICE CLUB (JR.)- SAN JUAN BATANGAS",
    "PUREGOLD PRICE CLUB - ROSARIO BATANGAS",
    "PUREGOLD PRICE CLUB - LIPA",
    "PUREGOLD PRICE CLUB - TANAUAN",
    "PUREGOLD PRICE CLUB - STO.TOMAS BATANGAS",
    "PUREGOLD PRICE CLUB - CALAUAN",
    "PUREGOLD PRICE CLUB - NEW MARKET BATANGAS (G)",
    "PUREGOLD PRICE CLUB - CALICANTO",
    "PUREGOLD PRICE CLUB - BOAC MARINDUQUE",
    "PUREGOLD PRICE CLUB - LUCENA",
    "PUREGOLD PRICE CLUB - TANZA",
    "PUREGOLD PRICE CLUB - CARMONA",
    "PUREGOLD PRICE CLUB - GMA",
    "PUREGOLD PRICE CLUB - BUCANDALA",
    "PUREGOLD PRICE CLUB - BACOOR",
    "PUREGOLD PRICE CLUB - ANABU",
    "PUREGOLD PRICE CLUB (JR.)- PALIPARAN",
    "PUREGOLD PRICE CLUB (EXTRA.)- MAGDIWANG",
    "PUREGOLD PRICE CLUB (JR.)- MARCOS ALVAREZ",
    "PUREGOLD PRICE CLUB - MOLINO BLVD.",
    "PUREGOLD PRICE CLUB - MOLINO TOWN CENTER",
    "PUREGOLD PRICE CLUB - MOLINO ROAD",
    "PUREGOLD PRICE CLUB - NOVELETA OASIS",
    "PUREGOLD PRICE CLUB - KAWIT",
    "PUREGOLD PRICE CLUB - ROSARIO",
    "PUREGOLD PRICE CLUB - NOVELETA",
    "PUREGOLD PRICE CLUB (EXTRA.)- PRINZA",
    "PUREGOLD DIVIMART - MANGGAHAN",
    "PUREGOLD PRICE CLUB (JR.)- HUGO PEREZ",
    "PUREGOLD DIVIMART - INOCENCIO",
    "PUREGOLD PRICE CLUB - BROOKSIDE LANE",
    "PUREGOLD PRICE CLUB (JR.)- GEN TRIAS",
    "PUREGOLD PRICE CLUB - BUHAY NA TUBIG",
    "PUREGOLD PRICE CLUB - TERMINAL MALL",
    "PUREGOLD PRICE CLUB - DASMARINAS HIGH WAY",
    "PUREGOLD PRICE CLUB (JR.)- DASMA BAYAN",
    "PUREGOLD PRICE CLUB - TANZANG LUMA",
    "PUREGOLD PRICE CLUB (JR.)- GOLDEN CITY",
    "PUREGOLD PRICE CLUB (JR.)- HABAY",
    "PUREGOLD PRICE CLUB - SILANG",
    "PUREGOLD PRICE CLUB (JR.)- TAGAYTAY-A",
    "PUREGOLD PRICE CLUB (EXTRA.)- TAGAYTAY",
    "PUREGOLD PRICE CLUB (JR.)- NAIC",
    "PUREGOLD PRICE CLUB - SAN PEDRO",
    "PUREGOLD PRICE CLUB - LANGGAM",
    "PUREGOLD PRICE CLUB (JR.)- BINAN",
    "PUREGOLD PRICE CLUB - BINAN BAYAN",
    "PUREGOLD PRICE CLUB (EXTRA.)- HALANG",
    "PUREGOLD PRICE CLUB - DIGOS",
    "PUREGOLD PRICE CLUB - TAGUM",
    "PUREGOLD PRICE CLUB - STO.TOMAS",
    "PUREGOLD PRICE CLUB - LANANG",
    "PUREGOLD PRICE CLUB - COTABATO MAIN",
    "PUREGOLD PRICE CLUB - COTABATO FIESTA MALL",
    "PUREGOLD PRICE CLUB - OZAMIS",
    "PUREGOLD PRICE CLUB - CAGAYAN DE ORO",
    "PUREGOLD PRICE CLUB - VALENCIA",
    "PUREGOLD - ILIGAN",
    "PUREGOLD PRICE CLUB - BUTUAN",
    "PUREGOLD PRICE CLUB - LANGIHAN",
    "PUREGOLD JR. ELVINDA",
    "PUREGOLD JUNIOR - CABUYAO BAYAN",
    "PUREGOLD - CALAPAN",
    "PUREGOLD CROSSING EAST",
    "PUREGOLD PRICE CLUB - IRIGA",
    "PUREGOLD PRICE CLUB - PILI",
    "PUREGOLD PRICE CLUB - NAGA DIVERSION",
    "PUREGOLD PRICE CLUB - CENTRO NAGA",
    "PUREGOLD PRICE CLUB - LEGAZPI ALBAY",
    "PUREGOLD PRICE CLUB - SORSOGON",
    "PUREGOLD PRICE CLUB - IROSIN SORSOGON",
    "PUREGOLD PRICE CLUB -GUIHULNGAN",
    "PUREGOLD PRICE CLUB - LIBERTAD BACOLOD",
    "PUREGOLD PRICE CLUB (JR.) -CENTROPLEX",
    "PUREGOLD PRICE CLUB - MANSILINGAN",
    "PUREGOLD PRICE CLUB -PORT BACOLOD",
    "PUREGOLD PRICE CLUB -BATA BACOLOD",
    "PUREGOLD PRICE CLUB -888 CHINA TOWN SQUARE",
    "PUREGOLD PRICE CLUB -HINIGARAN",
    "PUREGOLD PRICE CLUB - KABANKALAN",
    "PUREGOLD PRICE CLUB - BAROTAC VIEJO",
    "PUREGOLD PRICE CLUB - BAROTAC NUEVO",
    "PUREGOLD PRICE CLUB - ESCALANTE",
    "PUREGOLD - CADIZ",
    "PUREGOLD PRICE CLUB - BURGOS",
    "PUREGOLD PRICE CLUB - LEGAZPI",
    "PUREGOLD - PONTEVEDRA ROXAS",
    "PUREGOLD PRICE CLUB -BAYBAY GOODSHOP",
    "PUREGOLD PRICE CLUB -PUEBLO DE PANAY",
    "PUREGOLD PRICE CLUB-OTON",
    "PUREGOLD - JARO",
    "PUREGOLD PRICE CLUB - PAVIA",
    "PUREGOLD PRICE CLUB - STA.BARBARA",
    "PUREGOLD PRICE CLUB -SAN CARLOS",
    "PUREGOLD - BAYAWAN",
    "PUREGOLD - LA CASTELLANA",
    "PUREGOLD - CANLAON",
    "PUREGOLD - CALINOG",
    "PUREGOLD PRICE CLUB - MARASBARAS",
    "PUREGOLD PRICE CLUB - REAL TACLOBAN",
    "PUREGOLD PRICE CLUB - CALANIPAWAN",
    "PUREGOLD PRICE CLUB - KANANGA",
    "PUREGOLD PRICE CLUB - CARIGARA",
    "PUREGOLD PRICE CLUB - ABUYOG",
    "PUREGOLD PRICE CLUB - DULAG",
    "PUREGOLD PRICE CLUB - ALANG-ALANG",
    "PUREGOLD PRICE CLUB - PALO",
    "PUREGOLD PRICE CLUB - BORONGAN",
    "PUREGOLD PRICE CLUB - DOLORES",
    "PUREGOLD PRICE CLUB - BAYBAY LEYTE",
    "PUREGOLD PRICE CLUB - ORMOC",
    "PUREGOLD PRICE CLUB - SOGOD",
    "PUREGOLD PRICE CLUB - BATO",
    "PUREGOLD PRICE CLUB - ABUCAY",
    "PUREGOLD - MANGO",
    "PUREGOLD - TALISAY",
    "PUREGOLD - GUADALUPE",
    "PUREGOLD- KASAMBAGAN",
    "PUREGOLD PRICE CLUB - SINDALAN"
  ]);

  const [open, setOpen] = React.useState(false);
  const [selectedBranch, setSelectedBranch] = React.useState();
  const [selectedCategory, setSelectedCategory] = React.useState("");
  const [selectedSKU, setSelectedSKU] = React.useState(null);
  const [dropdownValue, setDropdownValue] = React.useState("");
  const [dateFilter, setDateFilter] = React.useState(null);
  const [selectedSKUs, setSelectedSKUs] = React.useState([]);
  const [disabledSKUs, setDisabledSKUs] = React.useState([]);
  const [highlightedSKUs, setHighlightedSKUs] = React.useState([]);
  const [openSavedSkusModal, setOpenSavedSkusModal] = React.useState(false);
  const [savedSkus, setSavedSkus] = React.useState([]);
  const [selectAll, setSelectAll] = React.useState(false);
  const [openSecondaryModal, setOpenSecondaryModal] = React.useState(false);
  const [selectedSku, setSelectedSku] = React.useState("");
  const [openStatusModal, setOpenStatusModal] = React.useState(false);
  const [statusCategory, setStatusCategory] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [statusSKU, setStatusSKU] = React.useState(null);
  const [filteredSkus, setFilteredSkus] = React.useState([]);

  const handleOpenStatusModal = (row) => {
    const { branchName } = row;
    const category = statusCategory || ""; // Use current category or reset
    const skus = savedSkus[category] || [];

    // Filter SKUs based on enabled status and required status
    const filteredSkus = skus
      .flat()
      .filter(
        (sku) =>
          !sku.enabled &&
          (sku.status === "Not Carried" || sku.status === "Delisted")
      );

    setSelectedBranch(branchName); // Set the branch from the row data
    setStatusCategory(""); // Reset the category
    setStatus(""); // Reset the status
    setStatusSKU(null); // Reset SKU
    setFilteredSkus(filteredSkus); // Set the filtered SKUs for the modal
    setOpenStatusModal(true);
  };

  // Handler to close the new status modal
  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
  };

  // Handle category change in the status modal
  const handleStatusCategoryChange = async (event) => {
    const selectedCategory = event.target.value;
    setStatusCategory(selectedCategory);
    setStatus(""); // Clear status
    setStatusSKU(""); // Clear SKU

    // If a category is selected, update SKUs
    if (selectedCategory) {
      // No need to call handleStatusChange here; it will be called separately
      setFilteredSkus([]);
    } else {
      setFilteredSkus([]);
    }
  };

  const handleStatusChange = async (event) => {
    const selectedStatus = event.target.value;
    setStatus(selectedStatus);
    setStatusSKU(""); // Clear SKU

    // Fetch SKUs if both category and status are selected
    if (statusCategory && selectedStatus) {
      try {
        const response = await fetch(
          `http://192.168.50.55:8080/get-skus-by-status?branch=${encodeURIComponent(
            selectedBranch
          )}&statusCategory=${encodeURIComponent(
            statusCategory
          )}&status=${encodeURIComponent(selectedStatus)}`
        );
        const data = await response.json();

        if (response.ok) {
          setFilteredSkus(data);
        } else {
          console.error("Failed to fetch SKUs:", data.message);
          setFilteredSkus([]);
        }
      } catch (error) {
        console.error("Error fetching SKUs:", error);
        setFilteredSkus([]);
      }
    } else {
      setFilteredSkus([]);
    }
  };

  const handleStatusSKUChange = (event) => {
    setStatusSKU(event.target.value);
  };

  const isCarriedButtonDisabled = () => {
    // Disable the button if the status is "Delisted" or if the status is "Not Carried" and no SKU is selected
    return status === "Delisted" || (status === "Not Carried" && !statusSKU);
  };

  const handleOpenSecondaryModal = () => {
    setOpenSecondaryModal(true);
  };

  const handleCloseSecondaryModal = () => {
    setOpenSecondaryModal(false);
  };

  const handleSkuChange = (event) => {
    setSelectedSku(event.target.value);
  };

  const handleOpen = (branch, category) => {
    setSelectedCategory(category);
    setSelectedBranch(branch);
    setSelectedCategory("");
    setSelectedSKU(null);
    setSelectAll(false); // Reset select all to false when opening the modal
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedSKUs([]); // Clear the selected SKUs
    setOpen(false); // Close the modal
  };

  const handleDropdownChange = (event) => {
    const value = event.target.value;
    setDropdownValue(value);
    setSelectedSKU(
      skus[selectedCategory]?.find((sku) => sku.SKUDescription === value) ||
        null
    );
  };
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    setFilteredSkus(skus[category] || []); // Update filtered SKUs based on selected category
    setSelectedSKU(null);
  };

  const columns = [
    { field: "id", headerName: "#", width: 75 },
    {
      field: "branchName",
      headerName: "ACCOUNT BRANCH",
      width: 600,
      headerClassName: "bold-header",
    },
    {
      field: "actions",
      headerName: "SKU DESCRIPTION",
      width: 180,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color="warning"
          onClick={() => handleOpen(params.row.branchName)}
        >
          Add SKU
        </Button>
      ),
    },
    {
      field: "saveSkus",
      headerName: "CATEGORY",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenSavedSkus(params.row.branchName, "V1")}
        >
          V1
        </Button>
      ),
    },
    {
      field: "saveSkus2",
      headerName: "CATEGORY",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenSavedSkus(params.row.branchName, "V2")}
        >
          V2
        </Button>
      ),
    },
    {
      field: "saveSkus3",
      headerName: "CATEGORY",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() => handleOpenSavedSkus(params.row.branchName, "V3")}
        >
          V3
        </Button>
      ),
    },
    {
      field: "STATUS",
      headerName: "SKU STATUS",
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={() => handleOpenStatusModal(params.row)}
        >
          STATUS
        </Button>
      ),
    },
  ];

  const rows = branches.map((branch, index) => ({
    id: index + 1,
    branchName: branch,
  }));

  const handleOpenSavedSkus = async (branch, category) => {
    setSavedSkus({});
    setSelectedCategory(category);
    setSelectedBranch(branch);

    try {
      const response = await fetch(
        `http://192.168.50.55:8080/get-skus?accountNameBranchManning=${encodeURIComponent(
          branch
        )}`
      );
      const data = await response.json();

      if (response.ok) {
        setSavedSkus(data || {});
        setFilteredSkus(data[category] || []); // Update filtered SKUs based on the selected category
      } else {
        console.error("Failed to fetch saved SKUs:", data.message);
      }
    } catch (error) {
      console.error("Error fetching saved SKUs:", error);
    }

    setOpenSavedSkusModal(true);
  };

  const handleCloseSavedSkusModal = () => setOpenSavedSkusModal(false);

  const handleSave = async () => {
    handleClose();
    setSelectedSKUs([]);
    try {
      if (!selectedSKUs || selectedSKUs.length === 0) {
        console.warn("No SKUs selected for saving.");
        return;
      }

      const skusToSave = selectedSKUs.map((sku) => ({
        SKUDescription: sku.SKUDescription || "Unknown SKU",
        enabled: true, // or the appropriate value
      }));

      const response = await fetch(
        "http://192.168.50.55:8080/save-branch-sku",
        {
          method: "POST",
          body: JSON.stringify({
            accountNameBranchManning: selectedBranch,
            category: selectedCategory,
            skus: skusToSave,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response:", data);

      if (data.data && data.data.length === 0) {
        console.error("No documents were inserted");
      } else {
        console.log("BranchSKUs saved successfully:", data);
        handleClose(); // Close the modal after successful save
        // Optionally, update the dropdown with saved SKUs here
      }
    } catch (error) {
      console.error("Error saving BranchSKUs:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedSKUs([]);
      setSelectAll(false);
    } else {
      // Select all
      setSelectedSKUs(skus[selectedCategory] || []);
      setSelectAll(true);
    }
  };

  const handleAutocompleteChange = (event, newValue) => {
    setSelectedSKUs(newValue);
    setSelectAll(newValue.length === (skus[selectedCategory] || []).length);
  };

  const handleNotCarried = async () => {
    if (!selectedCategory || !selectedSku || !selectedBranch) {
      // Handle case where no category or SKU is selected
      alert("Please select a category and SKU first.");
      return;
    }

    try {
      const response = await fetch("http://192.168.50.55:8080/disable-sku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: selectedBranch, // Replace with the actual branch identifier
          category: selectedCategory,
          skuDescription: selectedSku,
          enabled: false, // Set SKU as disabled
          status: "Not Carried", // Add a status tag
        }),
      });

      if (response.ok) {
        alert("SKU has been disabled.");
        handleCloseSecondaryModal(); // Close modal on success
      } else {
        alert("Failed to disable SKU.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while disabling the SKU.");
    }
  };

  const handleCarried = async () => {
    if (!statusCategory || !statusSKU || status === "Delisted") {
      alert("Please select a valid category and SKU first.");
      return;
    }

    try {
      const response = await fetch("http://192.168.50.55:8080/enable-sku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: selectedBranch,
          category: statusCategory,
          skuDescription: statusSKU,
          enabled: true, // Set SKU as enabled
          status: "Carried", // Update status to "Carried"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('SKU enabled and status updated to "Carried" successfully.');
        // Optionally, refresh the SKU list or perform other UI updates
      } else {
        alert(`Failed to update SKU: ${data.message}`);
      }
    } catch (error) {
      console.error("Error enabling SKU:", error);
      alert("Error enabling SKU. Please try again.");
    }
  };

  const handleDelisted = async () => {
    if (!selectedCategory || !selectedSku) {
      alert("Please select a category and SKU first.");
      return;
    }

    try {
      const response = await fetch("http://192.168.50.55:8080/delisted-sku", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          branch: selectedBranch, // Use the selected branch state
          category: selectedCategory,
          skuDescription: selectedSku,
          enabled: false, // Set SKU as disabled
          status: "Delisted", // Add a status tag
        }),
      });

      if (response.ok) {
        alert("SKU has been marked as Delisted.");
        await handleOpenSavedSkus(selectedBranch, selectedCategory); // Refresh SKUs
        handleCloseSecondaryModal(); // Close modal on success
      } else {
        alert("Failed to mark SKU as Delisted.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while marking the SKU as Delisted.");
    }
  };

  const handleSaveStatus = async () => {
    if (!selectedCategory || !status || !selectedSku) {
      alert("Please select category, status, and SKU.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.50.55:8080/update-sku-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            branch: selectedBranch,
            category: selectedCategory,
            status: status,
            skuDescription: selectedSku,
          }),
        }
      );

      if (response.ok) {
        alert("SKU status updated successfully.");
        handleCloseStatusModal();
      } else {
        alert("Failed to update SKU status.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while updating SKU status.");
    }
  };

  return (
    <div className="attendance">
      <Topbar />
      <div className="container">
        <Sidebar />
        <div style={{ height: "100%", width: "100%", marginLeft: "100" }}>
          <Stack
            direction={{ xs: "column", md: "row", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            // sx={{ marginBottom: "20px" }}
          >
            {/* <div className="MuiStack-root">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  onChange={(newValue) => setDateFilter(newValue)}
                  slotProps={{ textField: { size: "small" } }}
                />
              </LocalizationProvider>
            </div> */}
          </Stack>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            slots={{
              toolbar: GridToolbar,
            }}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
              },
            }}
            disableColumnFilter
            disableColumnSelector
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 20, 30]}
            getRowId={(row) => row.id}
          />
        </div>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {selectedBranch}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="category-select-label">
                Select Category
              </InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Select Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="V1">V1</MenuItem>
                <MenuItem value="V2">V2</MenuItem>
                <MenuItem value="V3">V3</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                getOptionLabel={(option) => option.SKUDescription || ""}
                value={selectedSKUs}
                onChange={handleAutocompleteChange}
                renderInput={(params) => (
                  <TextField {...params} label="Select SKU(s)" />
                )}
                options={skus[selectedCategory] || []}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      icon={<span />}
                      checkedIcon={<span />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.SKUDescription}
                  </li>
                )}
              />
            </FormControl>

            {selectedSKUs && selectedSKUs.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                {selectedSKUs.map((sku, index) => (
                  <div key={index}>
                    {/* Optionally display additional SKU details here */}
                  </div>
                ))}
              </Box>
            )}

            <Button
              variant="contained"
              onClick={handleToggleSelectAll}
              sx={{ mt: 2 }} // Ensure consistent margin
            >
              {selectAll ? "Deselect All" : "Select All"}
            </Button>

            <Box sx={{ marginTop: 2 }}>
              <Button variant="contained" color="success" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openSavedSkusModal}
          onClose={() => setOpenSavedSkusModal(false)}
          aria-labelledby="saved-skus-modal-title"
          aria-describedby="saved-skus-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography id="saved-skus-modal-title" variant="h6" component="h2">
              Saved SKUs for {selectedBranch} - Category: {selectedCategory}
            </Typography>
            {Object.keys(savedSkus).length > 0 ? (
              Object.entries(savedSkus).map(
                ([category, skus], index) =>
                  category === selectedCategory && (
                    <Box key={index} sx={{ marginTop: 2 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        Category: {category}
                      </Typography>
                      {skus.map((skuArray, idx) =>
                        skuArray.map((sku, skuIdx) => (
                          <Typography
                            key={skuIdx}
                            variant="body1"
                            sx={{ fontSize: "0.75rem" }}
                          >
                            <strong>SKU Description:</strong>{" "}
                            {sku.SKUDescription}
                          </Typography>
                        ))
                      )}
                    </Box>
                  )
              )
            ) : (
              <Typography variant="body1" sx={{ marginTop: 2 }}>
                No SKUs saved for this branch in this category.
              </Typography>
            )}
            <Box
              sx={{
                marginTop: 2,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={() => setOpenSavedSkusModal(false)}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="success"
                sx={{ backgroundColor: "warning", color: "white" }}
                onClick={handleOpenSecondaryModal}
              >
                SET STATUS
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Secondary Modal */}
        <Modal
          open={openSecondaryModal}
          onClose={handleCloseSecondaryModal}
          aria-labelledby="secondary-modal-title"
          aria-describedby="secondary-modal-description"
        >
          <Box sx={{ ...style, width: 500 }}>
            <Typography id="secondary-modal-title" variant="h6" component="h2">
              Select Category and SKU
            </Typography>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select value={selectedCategory} onChange={handleCategoryChange}>
                {/* Replace these with your actual categories */}
                <MenuItem value="V1">V1</MenuItem>
                <MenuItem value="V2">V2</MenuItem>
                <MenuItem value="V3">V3</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>SKU</InputLabel>
              <Select
                value={selectedSku}
                onChange={handleSkuChange}
                disabled={!selectedCategory} // Disable until a category is selected
              >
                {selectedCategory &&
                savedSkus[selectedCategory] &&
                savedSkus[selectedCategory].length > 0 ? (
                  savedSkus[selectedCategory].map((skuArray, idx) =>
                    skuArray.map((sku, skuIdx) => (
                      <MenuItem key={skuIdx} value={sku.SKUDescription}>
                        {sku.SKUDescription}
                      </MenuItem>
                    ))
                  )
                ) : (
                  <MenuItem value="" disabled>
                    No SKUs available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
            <Box
              sx={{
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseSecondaryModal}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="warning"
                sx={{ backgroundColor: "warning", color: "white" }}
                onClick={handleNotCarried}
              >
                Not Carried
              </Button>
              <Button
                variant="contained"
                color="secondary"
                sx={{ backgroundColor: "error", color: "white" }}
                onClick={handleDelisted}
              >
                Delisted
              </Button>
            </Box>
          </Box>
        </Modal>

        <Modal
          open={openStatusModal}
          onClose={handleCloseStatusModal}
          aria-labelledby="status-modal-title"
          aria-describedby="status-modal-description"
        >
          <Box sx={{ ...style, width: 1000 }}>
            <Typography id="status-modal-title" variant="h6" component="h2">
              Update SKU Status for {selectedBranch}
            </Typography>

            {/* Category Dropdown */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={statusCategory}
                onChange={handleStatusCategoryChange}
              >
                <MenuItem value="V1">V1</MenuItem>
                <MenuItem value="V2">V2</MenuItem>
                <MenuItem value="V3">V3</MenuItem>
              </Select>
            </FormControl>

            {/* Status Dropdown */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                disabled={!statusCategory} // Disable until category is selected
              >
                <MenuItem value="Not Carried">Not Carried</MenuItem>
                <MenuItem value="Delisted">Delisted</MenuItem>
              </Select>
            </FormControl>

            {/* SKU Dropdown */}
            <FormControl fullWidth sx={{ marginTop: 2 }}>
              <InputLabel>SKU</InputLabel>
              <Select
                value={statusSKU}
                onChange={handleStatusSKUChange}
                disabled={!statusCategory || !status} // Disable until both category and status are selected
              >
                {filteredSkus.length > 0 ? (
                  filteredSkus.map((sku, idx) => (
                    <MenuItem key={idx} value={sku.SKUDescription}>
                      {sku.SKUDescription}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No SKUs available
                  </MenuItem>
                )}
              </Select>
            </FormControl>

            <Box
              sx={{
                marginTop: 4,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleCarried}
                disabled={isCarriedButtonDisabled()} // Disable button based on the condition
              >
                Carried
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleCloseStatusModal}
              >
                Close
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
