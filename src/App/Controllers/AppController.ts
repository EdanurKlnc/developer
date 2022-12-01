import { TextConsole } from "@tuval/core";
import {
  cLeading,
  Color,
  cTop,
  ForEach,
  HStack,
  ScrollView,
  Spacer,
  State,
  Text,
  TextField,
  TForm,
  UIButton,
  UIController,
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

  private setItemLocalStorage() {
    this.rehberList.push(this.rehberItem);
    localStorage.setItem("rehbers", JSON.stringify(this.rehberList));
  }

  public LoadView() {  //Bütün görünümler buranın içine yazılır
    return UIScene(
      VStack({ alignment: cTop, spacing: 20 })(
        Text("Rehber Uygulaması").fontSize(30).fontWeight("lighter"),
        HStack({ spacing: 20 })(
          //Icon("\\e7fd"),
          TextField()
            .placeholder("Person Name")
            .onTextChange((value) => (this.rehberItem.textname = value)),
          TextField()
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
                index //Dizideki nesneleri tek tek döndürür.
              ) =>
                HStack({ alignment: cLeading, spacing: 10 })(  //yana yaslı
            
                  Text(item.textname).foregroundColor("white").fontSize(15),
                  Spacer(),
                  Text(item.textsurname).foregroundColor("white").fontSize(15),
                  Spacer(), //İki yanındakinide sağa ve sola yaslar
                  UIButton(Text("Edit"))
                    .background({ default: "white", hover: Color.blue300 })
                    .foregroundColor({ default: Color.blue300, hover: "white" })
                    .cornerRadius(10)
                    .padding(10)
                    .transition("all .3s"),
                  UIButton(Text("Delete"))
                    .background({ default: "white", hover: Color.blue300 })
                    .foregroundColor({ default: Color.blue300, hover: "white" })
                    .cornerRadius(10)
                    .padding(10)
                    .transition("all .3s")
                )
                  .height(50)
                  .width(400)
            )
          )
        ).background(Color.blue600)
      ).padding(50)
    );
  }
}
