import { Component, OnInit, } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'channel-modal',
  templateUrl: './channel.modal.html',
  styleUrls: ['./channel.modal.scss'],
})
export class CommunicationChannelModal implements OnInit {
  channelTypes = [
    { id: 0, text: 'None' },
    { id: 1, text: 'Home' },
    { id: 2, text: 'Work' },
    { id: 3, text: 'Cell' },
    { id: 4, text: 'Personal email' },
    { id: 5, text: 'Work email' },
    { id: 6, text: 'Home page' },
    { id: 7, text: 'Whatsapp' },
    { id: 8, text: 'Facebook' },
    { id: 9, text: 'LinkedIn' },
    { id: 10, text: 'Skype' },
    { id: 11, text: 'iMobile' }
  ]

  public channell;
  public text;

  constructor(private modalCtrl: ModalController) { }

  async ngOnInit() {

  }

  onSubmit() {
    const obj = { channel: this.channell, text: this.text };
    this.close(obj);
  }

  close(obj) {
    this.modalCtrl.dismiss(obj);
  }
}
