import React, { useState } from 'react';
import {
  AdaptivityProvider,
  AppRoot,
  View,
  Panel,
  PanelHeader,
  Group,
  FormLayout,
  File,
  Input,
  Textarea,
  Button,
  Avatar,
  FormItem,
  Div,
  ConfigProvider
} from '@vkontakte/vkui';
import { Icon24Camera } from '@vkontakte/icons';
import { exportToPDF, exportToDOCX } from './services/exportService';
import '@vkontakte/vkui/dist/vkui.css';

function App() {
  const [formData, setFormData] = useState({
    fullName: '',
    photo: null,
    contacts: '',
    specialization: '', // Добавлено поле для направления специальности
    skills: '', // Добавлено поле для навыков
    education: '',
    experience: ''
  });

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, photo: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = async (format) => {
    try {
      if (format === 'pdf') {
        await exportToPDF(formData);
      } else if (format === 'docx') {
        await exportToDOCX(formData);
      }
    } catch (error) {
      console.error('Ошибка при экспорте:', error);
    }
  };

  return (
    <AdaptivityProvider>
      <ConfigProvider>
        <AppRoot>
          <View activePanel="main">
            <Panel id="main">
              <PanelHeader>РезюмеКрафт VK</PanelHeader>
              <Group>
                <FormLayout>
                  <FormItem top="Фотография">
                    <File
                      before={<Icon24Camera />}
                      size="m"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                    />
                    {formData.photo && (
                      <Div>
                        <Avatar size={80} src={formData.photo} />
                      </Div>
                    )}
                  </FormItem>

                  <FormItem top="Фамилия и имя" status={formData.fullName ? 'valid' : 'error'}>
                    <Input
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </FormItem>

                  <FormItem top="Контактные данные">
                    <Input
                      required
                      value={formData.contacts}
                      onChange={(e) => setFormData({...formData, contacts: e.target.value})}
                    />
                  </FormItem>

                  <FormItem top="Направление специальности">
                    <Input
                      required
                      value={formData.specialization}
                      onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                      placeholder="Например: Frontend-разработчик"
                    />
                  </FormItem>

                  <FormItem top="Профессиональные навыки">
                    <Textarea
                      required
                      value={formData.skills}
                      onChange={(e) => setFormData({...formData, skills: e.target.value})}
                      placeholder="Перечислите ваши ключевые навыки"
                    />
                  </FormItem>

                  <FormItem top="Образование">
                    <Textarea
                      required
                      value={formData.education}
                      onChange={(e) => setFormData({...formData, education: e.target.value})}
                    />
                  </FormItem>

                  <FormItem top="Опыт работы">
                    <Textarea
                      required
                      value={formData.experience}
                      onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    />
                  </FormItem>

                  <FormItem>
                    <Button size="l" stretched onClick={() => handleSubmit('pdf')}>
                      Экспорт в PDF
                    </Button>
                  </FormItem>

                  <FormItem>
                    <Button size="l" stretched onClick={() => handleSubmit('docx')}>
                      Экспорт в DOCX
                    </Button>
                  </FormItem>
                </FormLayout>
              </Group>
            </Panel>
          </View>
        </AppRoot>
      </ConfigProvider>
    </AdaptivityProvider>
  );
}

export default App;