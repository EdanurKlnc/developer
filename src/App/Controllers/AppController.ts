import { TextConsole } from "@tuval/core";
import {
    bindState,
  cLeading,
  Color,
  cTop,
  ForEach,
  HStack,
  Icon,
  ScrollView,
  Spacer,
  State,
  Text,
  TextField,
  TForm,
  UIButton,
  UIController,
  UIIconClass,
  UIScene,
  VStack,
} from "@tuval/forms";

interface rehber {
  textname: string;
  textsurname: string;
}

export class AppController extends UIController {
  @State()
  private menu_text: string;

  @State() // Değişken değiştiğinde görünümü değiştiriyor
  private rehberItem: rehber = {
    textname: "",
    textsurname: "",
  };
  @State()
  private rehberList: rehber[] = [] //Rehber nesnesini içeren dizi

  protected BindRouterParams() { //Görünüm yüklenmeden içerisindeki işlemleri bitirir
    const rehbers = localStorage.getItem("rehbers");
    if (!rehbers) {
      localStorage.setItem("rehbers", JSON.stringify([]));
    } else {
      this.rehberList = JSON.parse(localStorage.getItem("rehbers"));
    }
  }

  protected InitController() {
    this.menu_text = "About";
  }

  public OnBindModel(form: TForm) {}
  
  private getLocalStorage(){ 
      this.rehberList = [] //listeyi boşaltıyoruz
      this.rehberList = JSON.parse(localStorage.getItem("rehbers")) 
      
  }

  private setItemLocalStorage() { //Girilen veriyi ekleme
    this.rehberList.push(this.rehberItem)
    localStorage.setItem("rehbers", JSON.stringify(this.rehberList))
    this.getLocalStorage() // fonksiyonu çağırdık
  }

private deleteItemFormLocalStorage(index:number){ //Veri silme
    this.rehberList.splice(index, 1) //indextekini alıp silecek
    localStorage.setItem("rehbers",JSON.stringify(this.rehberList)) //veriyi sildikten sonra yeni listeyi localStorage gönderme
    this.getLocalStorage() //görünümün değişmesi için bu fonksiyonu çağırdık
}

private saveEdit(){
        localStorage.setItem("rehbers",JSON.stringify(this.rehberList)) //veriyi sildikten sonra yeni listeyi localStorage gönderme
        this.getLocalStorage()
    
}



  public LoadView() {  //Bütün görünümler buranın içine yazılır
   const  [selectedIndex, setSelectedIndex] = bindState (-1) //düzenlemek için
   
    return UIScene(
      VStack({ alignment: cTop, spacing: 20 })(
        Text("Rehber Uygulaması").fontSize(30).fontWeight("lighter"),
        HStack({ spacing: 20 })(
           
          TextField()
            .placeholder("Person Name")
            .onTextChange((value) => (this.rehberItem.textname = value)),
          TextField()
            // Icon("\\e0cf")
            .placeholder("Phone Number")
            .onTextChange((value) => (this.rehberItem.textsurname = value)),
          UIButton(
            Text("Save")
              .background(Color.blue600)
              .foregroundColor("white")
              .padding("10px 15px")
              .cornerRadius(5)
          ).onClick(() => {
            this.setItemLocalStorage();
          })
        )
          .padding("10px 20px")
          .cornerRadius(10)
          .width(700)
          .height(50)
          .background("white"),
          
        ScrollView({ axes: "cVertical" })( //Sadece dikine kaydırma sağlar
          VStack({ alignment: cTop, spacing: 10 })(
                       Text("Contact List").fontSize(25).foregroundColor("white"),

            ...ForEach(this.rehberList)(
              (
                item,
                index //Dizideki nesneleri tek tek döndürür. İndexteki elemanı bulmamızı sağlar
              ) =>
              selectedIndex == index ?
              //Sağladığı zaman alacağımız görüntü
               HStack({ alignment: cLeading, spacing: 10 })(  //yana yaslı
                  TextField().value(this.rehberList[index].textname)
                  .onTextChange((value)=>{
                      this.rehberList[index].textname= value // editleneni indexteki textname yerine atadık
                  })
                  .foregroundColor("white").fontSize(15),
                  Spacer(),
                  TextField().value(this.rehberList[index].textsurname)
                    .onTextChange((value)=>{
                      this.rehberList[index].textsurname= value
                  })
                  .foregroundColor("white").fontSize(15),
                  UIButton(Text("Save")) 
                    .background({ default: "white", hover:"#14A44D" })
                    .foregroundColor({ default: "#14A44D", hover: "white" })
                    .cornerRadius(10)
                     .padding("10px 15px")
                    .transition("all .3s")
                    .onClick(()=>{
                        setSelectedIndex(-1),
                        this.saveEdit()
                        
                    })
               ).width()
               .borderBottom("1px solid white")
              :
              
              //Sağlamadığı zaman alacağımız görüntü
                HStack({ alignment: cLeading, spacing: 10 })(  //yana yaslı
                  Text(item.textname).foregroundColor("white").fontSize(15),
                  Spacer(),
                  Text(item.textsurname).foregroundColor("white").fontSize(15),
                  Spacer(), //İki yanındakinide sağa ve sola yaslar
                  UIButton(Text("Edit"))
                    .background({ default: "white", hover: Color.blue300 })
                    .foregroundColor({ default: Color.blue300, hover: "white" })
                    .cornerRadius(10)
                     .padding("10px 15px")
                    .transition("all .3s")
                    .onClick(()=>{
                        setSelectedIndex(index)
                    }),
                    
                  UIButton(Text("Delete"))
                    .background({ default: "white", hover: Color.blue300 })
                    .foregroundColor({ default: Color.blue300, hover: "white" })
                    .cornerRadius(10)
                    .padding("10px 15px")
                    .transition("all .3s")
                    .onClick(()=>{
                        this.deleteItemFormLocalStorage(index)    
                    })
                )
                  .height(50)
                  .width(400)
                  .borderBottom("1px solid white")
            ) 
          )
        ).background(Color.blue600)
      ).padding(50)
      
      
    );
  }
}
