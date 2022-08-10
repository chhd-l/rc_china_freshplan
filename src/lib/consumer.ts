import { PetGender, PetType } from '@/framework/types/consumer'

export const initNewPet = {
  age: '',
  id: '-1',
  name: '',
  type: PetType.Cat,
  gender: PetGender.Male,
  breed: '',
  isSterilized: false,
  birthday: '',
  image: '',
  // consumerId: '20220415',
}

export const editPetButton = [
  {
    text: '编辑',
    style: {
      backgroundColor: 'rgb(207, 224, 177)',
      width: '60PX',
      textAlign: 'center',
    },
  },
  {
    text: '删除',
    style: {
      backgroundColor: 'rgb(150, 204, 57)',
      width: '60PX',
      textAlign: 'center',
    },
  },
]
