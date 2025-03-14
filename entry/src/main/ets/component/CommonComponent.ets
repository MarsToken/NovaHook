import { GroupListBean } from "../bean/GroupListBean"

@Component
export struct ListView {
  private scroller: Scroller = new Scroller()
  private data?: GroupListBean[]
  private itemClick?: (item: string) => void

  build() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      List({ space: 20, scroller: this.scroller }) {
        ForEach(this.data, (dataElement: GroupListBean) => {
          ListItemGroup({ header: itemHead(dataElement.header) }) {
            ForEach(dataElement.cases, (itemElement: string) => {
              ItemView({
                text: itemElement
              }).onClick(() => {
                this.itemClick?.(itemElement)
              })
            })
          }.listStyle()
        })

      }
      .height('100%')
      .width('100%')
      .sticky(StickyStyle.Header)

      Button({ type: ButtonType.Circle }) {
        Image($r('app.media.icon_top'))
          .width(40)
          .height(40)
      }
      .width(60)
      .height(60)
      .backgroundColor(Color.Orange)
      .offset({ x: -20, y: -100 })
      .onClick(() => {
        this.scroller.scrollToIndex(0)
      })
    }
  }
}

@Component
export struct ItemView {
  @BuilderParam private text: string

  build() {
    ListItem() {
      Text(this.text)
        .itemTextStyle()
    }
  }
}

@Builder
function itemHead(text: string) {
  Text(text)
    .fontSize(35)
    .height(120)
    .backgroundColor('#87CEFA')
    .width('100%')
    .padding(5)
    .textAlign(TextAlign.Center)
}

@Extend(ListItemGroup)
function listStyle() {
  .backgroundColor(Color.White)
  .divider({
    strokeWidth: 2,
    startMargin: 10,
    endMargin: 10,
    color: '#ffe9f0f0'
  })
}

@Extend(Text)
function itemTextStyle() {
  .width('100%')
  .height(120)
  .textAlign(TextAlign.Center)
  .fontColor(Color.Black)
  .fontSize(30)
  .fontWeight(FontWeight.Normal)
  .backgroundColor('#C7EDCC')
  .borderRadius(10)
}