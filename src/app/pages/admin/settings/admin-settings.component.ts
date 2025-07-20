import { Component } from '@angular/core';
import { CharacterBusReader, CharacterBusWriter, ChatBusReader, DimensionBusReader, DimensionBusWriter, EventBusService } from '../../../services/backend/event-bus.service';

@Component({
  selector: 'app-admin-settings',
  imports: [],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.css'
})
export class AdminSettingsPage {

  constructor(
    protected _eventBusServer: EventBusService,
  ) {
  }

  resetCharacterWriter() {
    this._eventBusServer.resetCharacterBusWriter(CharacterBusWriter.Character);
  }
  resetCharacterDimensionReader() {
    this._eventBusServer.resetCharacterBusReader(CharacterBusReader.Dimension);
  }
  resetDimensionWriter() {
    this._eventBusServer.resetDimensionBusWriter(DimensionBusWriter.Dimension);
  }
  resetMapWriter() {
    this._eventBusServer.resetDimensionBusWriter(DimensionBusWriter.Map);
  }
  resetDimensionCharacterReader() {
    this._eventBusServer.resetDimensionBusReader(DimensionBusReader.Character);
  }
  resetChatCharacterReader() {
    this._eventBusServer.resetChatBusReader(ChatBusReader.Dimension);
  }
  resetChatDimensionReader() {
    this._eventBusServer.resetChatBusReader(ChatBusReader.Dimension);
  }
}
