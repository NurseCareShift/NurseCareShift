import React, { useReducer } from 'react';

interface JobInfoInputProps {
    onNext: (data: any) => void;
}

const JobInfoInput: React.FC<JobInfoInputProps> = ({ onNext }) => {
    const departmentOptions = [
        { value: 'ICU', label: 'ICU' },
        { value: 'HCU', label: 'HCU' },
        { value: 'NICU', label: 'NICU' },
        { value: 'ER', label: 'ER' },
        { value: '手術室', label: '手術室' },
        { value: '消化器内科', label: '消化器内科' },
        { value: '循環器内科', label: '循環器内科' },
        { value: '腎臓内科', label: '腎臓内科' },
        { value: '呼吸器内科', label: '呼吸器内科' },
        { value: '神経内科', label: '神経内科' },
        { value: '内分泌代謝内科', label: '内分泌代謝内科' },
        { value: '血液内科', label: '血液内科' },
        { value: '腫瘍内科', label: '腫瘍内科' },
        { value: '透析', label: '透析' },
        { value: '精神科', label: '精神科' },
        { value: '小児科', label: '小児科' },
        { value: '皮膚科', label: '皮膚科' },
        { value: '整形外科', label: '整形外科' },
        { value: '脳神経外科', label: '脳神経外科' },
        { value: '消化器外科', label: '消化器外科' },
        { value: '呼吸器外科', label: '呼吸器外科' },
        { value: '産婦人科', label: '産婦人科' },
        { value: '泌尿器科', label: '泌尿器科' },
        { value: '形成外科', label: '形成外科' },
        { value: '眼科', label: '眼科' },
        { value: '耳鼻咽喉科', label: '耳鼻咽喉科' },
        { value: '放射線科', label: '放射線科' },
        { value: 'リハビリテーション科', label: 'リハビリテーション科' },
        { value: '緩和ケア科', label: '緩和ケア科' },
        { value: '感染症科', label: '感染症科' },
        { value: '訪問看護師', label: '訪問看護師' },
        { value: '助産師', label: '助産師' },
        { value: '保健師', label: '保健師' },
        { value: 'その他', label: 'その他' }
    ];
        
        const certifiedNurseOptions = [
        { value: 'がん化学療法看護', label: 'がん化学療法看護' },
        { value: 'がん性疼痛看護', label: 'がん性疼痛看護' },
        { value: '緩和ケア', label: '緩和ケア' },
        { value: '皮膚・排泄ケア', label: '皮膚・排泄ケア' },
        { value: '感染管理', label: '感染管理' },
        { value: '糖尿病看護', label: '糖尿病看護' },
        { value: '新生児集中ケア', label: '新生児集中ケア' },
        { value: '不妊症看護', label: '不妊症看護' },
        { value: '透析看護', label: '透析看護' },
        { value: '手術看護', label: '手術看護' },
        { value: '救急看護', label: '救急看護' },
        { value: '集中ケア', label: '集中ケア' },
        { value: '訪問看護', label: '訪問看護' },
        { value: '認知症看護', label: '認知症看護' },
        { value: '乳がん看護', label: '乳がん看護' },
        { value: '小児救急看護', label: '小児救急看護' },
        { value: '摂食・嚥下障害看護', label: '摂食・嚥下障害看護' },
        { value: '脳卒中リハビリテーション看護', label: '脳卒中リハビリテーション看護' },
        { value: '慢性心不全看護', label: '慢性心不全看護' },
        { value: '心臓リハビリテーション看護', label: '心臓リハビリテーション看護' },
        { value: '整形外科看護', label: '整形外科看護' },
        { value: '周術期管理', label: '周術期管理' },
        { value: '精神科救急看護', label: '精神科救急看護' },
        { value: '母性看護', label: '母性看護' },
        { value: '慢性呼吸器疾患看護', label: '慢性呼吸器疾患看護' },
    ];
        
        const experienceOptions = [
        { value: '1年未満', label: '1年未満' },
        { value: '1年', label: '1年' },
        { value: '2年', label: '2年' },
        { value: '3年', label: '3年' },
        { value: '4年', label: '4年' },
        { value: '5年', label: '5年' },
        { value: '6年以上', label: '6年以上' },
    ];
        
        const specialistNurseOptions = [
        { value: 'がん看護', label: 'がん看護' },
        { value: '精神看護', label: '精神看護' },
        { value: '地域看護', label: '地域看護' },
        { value: '母性看護', label: '母性看護' },
        { value: '小児看護', label: '小児看護' },
        { value: '慢性疾患看護', label: '慢性疾患看護' },
        { value: '感染症看護', label: '感染症看護' },
        { value: '急性・重症患者看護', label: '急性・重症患者看護' },
        { value: '老人看護', label: '老人看護' },
        { value: '在宅看護', label: '在宅看護' },
        { value: '遺伝看護', label: '遺伝看護' },
        { value: '災害看護', label: '災害看護' },
    ];
        
        const advancedNurseOptions = [
        { value: '創傷管理', label: '創傷管理' },
        { value: '経管栄養管理', label: '経管栄養管理' },
        { value: '呼吸管理', label: '呼吸管理' },
        { value: '静脈カテーテル挿入', label: '静脈カテーテル挿入' },
        { value: '呼吸器装着中の患者の管理', label: '呼吸器装着中の患者の管理' },
        { value: '感染管理', label: '感染管理' },
        { value: '急性疾患の対応', label: '急性疾患の対応' },
        { value: '輸血療法', label: '輸血療法' },
    ];

  // 初期状態の定義
  const initialState = {
    isStudent: false,
    departments: [] as string[],
    experienceYears: {} as { [key: string]: string },
    certifiedNurseDetails: [] as string[],
    specialistNurseDetails: [] as string[],
    advancedNurseDetails: [] as string[],
    errors: {} as { departments?: string; experienceYears?: string },
    isAccordionOpen: {
      department: false,
      certifiedNurse: false,
      specialistNurse: false,
      advancedNurse: false,
    },
    otherDepartment: '',
  };

  // アクションの型定義
  type Action =
    | { type: 'SET_FIELD'; field: keyof typeof initialState; value: any }
    | { type: 'SET_ERROR'; field: keyof typeof initialState['errors']; error: string | null }
    | { type: 'TOGGLE_ACCORDION'; field: keyof typeof initialState['isAccordionOpen'] }
    | { type: 'SET_IS_STUDENT'; value: boolean };

  // リデューサー関数
  function formReducer(state: typeof initialState, action: Action) {
    switch (action.type) {
      case 'SET_FIELD':
        return { ...state, [action.field]: action.value };
      case 'SET_ERROR':
        return {
          ...state,
          errors: { ...state.errors, [action.field]: action.error },
        };
      case 'TOGGLE_ACCORDION':
        return {
          ...state,
          isAccordionOpen: {
            ...state.isAccordionOpen,
            [action.field]: !state.isAccordionOpen[action.field],
          },
        };
      case 'SET_IS_STUDENT':
        return { ...state, isStudent: action.value };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(formReducer, initialState);

  const validateDepartments = (departments: string[]): string | null => {
    return departments.length === 0
      ? '少なくとも1つの診療科を選択してください。'
      : null;
  };

  const handleCheckboxChange = (
    field:
      | 'departments'
      | 'certifiedNurseDetails'
      | 'specialistNurseDetails'
      | 'advancedNurseDetails',
    value: string
  ) => {
    const currentValue = state[field];
    if (Array.isArray(currentValue)) {
      const updatedValue = currentValue.includes(value)
        ? currentValue.filter((v: string) => v !== value)
        : [...currentValue, value];
      dispatch({ type: 'SET_FIELD', field, value: updatedValue });
    }
  };

  const handleSelectChange =
    (department: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      const updatedExperienceYears = {
        ...state.experienceYears,
        [department]: e.target.value,
      };
      dispatch({
        type: 'SET_FIELD',
        field: 'experienceYears',
        value: updatedExperienceYears,
      });
    };

  const toggleAccordion = (
    field: keyof typeof initialState['isAccordionOpen']
  ) => {
    dispatch({ type: 'TOGGLE_ACCORDION', field });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!state.isStudent) {
      const departmentsError = validateDepartments(state.departments);
      dispatch({
        type: 'SET_ERROR',
        field: 'departments',
        error: departmentsError,
      });

      if (departmentsError) {
        return;
      }
    }

    // データをonNextで送信して次のステップへ
    onNext({
      isStudent: state.isStudent,
      departments: state.departments,
      experienceYears: state.experienceYears,
      certifiedNurseDetails: state.certifiedNurseDetails,
      specialistNurseDetails: state.specialistNurseDetails,
      advancedNurseDetails: state.advancedNurseDetails,
      otherDepartment: state.otherDepartment,
    });
  };

  return (
    <div className="job-info-page flex justify-center items-center min-h-screen bg-blue-50 font-poppins">
      <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          職務情報入力
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 看護学生かどうかのチェックボックス */}
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={state.isStudent}
                onChange={(e) =>
                  dispatch({ type: 'SET_IS_STUDENT', value: e.target.checked })
                }
                className="mr-2 h-5 w-5 text-blue-600"
              />
              <span className="text-lg">私は看護学生です</span>
            </label>
          </div>

          {/* 以下の項目は看護学生でない場合のみ表示 */}
          {!state.isStudent && (
            <>
              {/* 診療科 */}
              <div className="accordion-section mb-6">
                <h3
                  className="cursor-pointer font-bold text-xl text-blue-600 flex items-center justify-between bg-blue-100 p-3 rounded-md"
                  onClick={() => toggleAccordion('department')}
                >
                  診療科の選択
                  <span>{state.isAccordionOpen['department'] ? '▲' : '▼'}</span>
                </h3>
                {state.isAccordionOpen['department'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {departmentOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={state.departments.includes(option.value)}
                            onChange={() =>
                              handleCheckboxChange('departments', option.value)
                            }
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>

                    {/* その他の診療科入力 */}
                    {state.departments.includes('その他') && (
                      <input
                        type="text"
                        value={state.otherDepartment || ''}
                        onChange={(e) =>
                          dispatch({
                            type: 'SET_FIELD',
                            field: 'otherDepartment',
                            value: e.target.value,
                          })
                        }
                        placeholder="その他の診療科を入力"
                        className="w-full mt-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    )}

                    {/* エラーメッセージ */}
                    {state.errors.departments && (
                      <p className="text-red-500 text-sm mt-2">
                        {state.errors.departments}
                      </p>
                    )}

                    {/* 診療科の経験年数選択 */}
                    {state.departments.map((department) => (
                      <div key={department} className="mt-4">
                        <label className="block text-gray-700 mb-2">
                          {department} の経験年数
                        </label>
                        <select
                          value={state.experienceYears[department] || ''}
                          onChange={handleSelectChange(department)}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="">年数を選択</option>
                          {experienceOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 認定看護師 */}
              <div className="accordion-section mb-6">
                <h3
                  className="cursor-pointer font-bold text-xl text-blue-600 flex items-center justify-between bg-blue-100 p-3 rounded-md"
                  onClick={() => toggleAccordion('certifiedNurse')}
                >
                  認定看護師
                  <span>
                    {state.isAccordionOpen['certifiedNurse'] ? '▲' : '▼'}
                  </span>
                </h3>
                {state.isAccordionOpen['certifiedNurse'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {certifiedNurseOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={state.certifiedNurseDetails.includes(
                              option.value
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                'certifiedNurseDetails',
                                option.value
                              )
                            }
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 専門看護師 */}
              <div className="accordion-section mb-6">
                <h3
                  className="cursor-pointer font-bold text-xl text-blue-600 flex items-center justify-between bg-blue-100 p-3 rounded-md"
                  onClick={() => toggleAccordion('specialistNurse')}
                >
                  専門看護師
                  <span>
                    {state.isAccordionOpen['specialistNurse'] ? '▲' : '▼'}
                  </span>
                </h3>
                {state.isAccordionOpen['specialistNurse'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {specialistNurseOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={state.specialistNurseDetails.includes(
                              option.value
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                'specialistNurseDetails',
                                option.value
                              )
                            }
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 特定行為研修修了看護師 */}
              <div className="accordion-section mb-6">
                <h3
                  className="cursor-pointer font-bold text-xl text-blue-600 flex items-center justify-between bg-blue-100 p-3 rounded-md"
                  onClick={() => toggleAccordion('advancedNurse')}
                >
                  特定行為研修修了看護師
                  <span>
                    {state.isAccordionOpen['advancedNurse'] ? '▲' : '▼'}
                  </span>
                </h3>
                {state.isAccordionOpen['advancedNurse'] && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {advancedNurseOptions.map((option) => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={state.advancedNurseDetails.includes(
                              option.value
                            )}
                            onChange={() =>
                              handleCheckboxChange(
                                'advancedNurseDetails',
                                option.value
                              )
                            }
                            className="mr-2 h-4 w-4 text-blue-600"
                          />
                          {option.label}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ボタン */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg shadow-lg transition duration-300"
          >
            次へ
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobInfoInput;