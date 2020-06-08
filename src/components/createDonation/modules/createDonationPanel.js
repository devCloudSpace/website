import React, { useState, useEffect } from 'react';
import {
  Button,
  InputField,
  Stack,
  Heading,
  Tag,
  Card,
  CardSection,
  Textarea,
  Popover,
  ListChoice,
  TextLink,
  Alert,
  Tooltip,
  InputGroup,
  Select,
  Text,
  Radio,
  ChoiceGroup,
} from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { months } from '../../../../utils/constants/month';
import GooglePlacesAutoCompleteField from '../../inputfield/GooglePlacesAutoCompleteField';
import api from '../../../../utils/api';

import DragNDropInputField from './DragNDropInputField';

const Container = styled.div`
  min-width: 300px;
  width: 100%;
`;

const CreateDonationPanel = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchCategories = () => {
    api.categories.getAll().then((categoriesDocs) => {
      const categories = categoriesDocs.docs.map((categoryDoc) => categoryDoc.data());
      setCategories(categories);
    });
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      validFromDay: '',
      validFromMonth: '',
      validFromYear: '',
      validToDay: '',
      validToMonth: '',
      validToYear: '',
      dimensions: '',
      location: '',
      itemCondition: '',
      categories: [],
      selectedImages: [],
    },
    //validationSchema: validationSchema,
    onSubmit: (values) => {
      //handleFormSubmission(values);
    },
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const onChoiceClicked = (category) => {
    // Allow only 3 categories
    if (!selectedCategories.includes(category) && selectedCategories.length <= 2) {
      setSelectedCategories([...selectedCategories, category]);
      formik.setFieldValue('categories', [...selectedCategories, category]);
    }
  };

  const onTagRemoveClicked = (category) => {
    if (selectedCategories.includes(category)) {
      let updatedSelectedCategories = selectedCategories.filter((value) => {
        return value !== category;
      });
      setSelectedCategories(updatedSelectedCategories);
      formik.setFieldValue('categories', updatedSelectedCategories);
    }
  };

  const CategoryListChoices = () => {
    return (
      <div>
        {categories.map((category) => (
          <ListChoice title={category.name} key={category.id} onClick={() => onChoiceClicked(category)} />
        ))}
      </div>
    );
  };

  const SelectedCategoryTags = () => {
    return (
      <>
        {selectedCategories.map((category) => (
          <Tag selected key={category.id} onRemove={() => onTagRemoveClicked(category)}>
            {category.name}
          </Tag>
        ))}
      </>
    );
  };

  return (
    <>
      <DragNDropInputField />

      <Container>
        <Card>
          <CardSection expanded>
            <form>
              <Stack spacing="extraLoose">
                <InputField
                  disabled={formik.isSubmitting}
                  label="Title"
                  name="title"
                  placeholder="Title"
                  error={formik.touched.title && formik.errors.title ? formik.errors.title : ''}
                  {...formik.getFieldProps('title')}
                  help="Allow 140 characters only"
                />

                <Textarea
                  disabled={formik.isSubmitting}
                  rows={10}
                  label="Description"
                  name="description"
                  placeholder="Description"
                  error={formik.touched.description && formik.errors.description ? formik.errors.description : ''}
                  {...formik.getFieldProps('description')}
                />

                <Stack direction="row">
                  <InputGroup
                    label="Valid From"
                    error={
                      formik.touched.validFromDay || formik.touched.validFromMonth || formik.touched.validFromYear
                        ? formik.errors.validFromDay ||
                          formik.errors.validFromMonth ||
                          formik.errors.validFromYear ||
                          formik.errors.customDateValidation
                        : ''
                    }
                    required
                  >
                    <InputField
                      placeholder="DD"
                      type="number"
                      inputMode="numeric"
                      maxValue={31}
                      minValue={1}
                      {...formik.getFieldProps('validFromDay')}
                    />
                    <Select options={months} placeholder="Month" {...formik.getFieldProps('validFromMonth')} />
                    <InputField
                      placeholder="YYYY"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validFromYear')}
                    />
                  </InputGroup>

                  <Text>To</Text>

                  <InputGroup
                    label="Valid To"
                    error={
                      formik.touched.validToDay || formik.touched.validToMonth || formik.touched.validToYear
                        ? formik.errors.validToDay ||
                          formik.errors.validToMonth ||
                          formik.errors.validToYear ||
                          formik.errors.customDateValidation
                        : ''
                    }
                    required
                  >
                    <InputField
                      placeholder="DD"
                      type="number"
                      inputMode="numeric"
                      maxValue={31}
                      minValue={1}
                      {...formik.getFieldProps('validToDay')}
                    />
                    <Select options={months} placeholder="Month" {...formik.getFieldProps('validToMonth')} />
                    <InputField
                      placeholder="YYYY"
                      type="number"
                      inputMode="numeric"
                      {...formik.getFieldProps('validToYear')}
                    />
                  </InputGroup>
                </Stack>

                <InputField
                  disabled={formik.isSubmitting}
                  label="Dimensions"
                  name="dimensions"
                  error={formik.touched.dimensions && formik.errors.dimensions ? formik.errors.dimensions : ''}
                  {...formik.getFieldProps('dimensions')}
                />

                <GooglePlacesAutoCompleteField
                  label={'Nearest MRT/LRT to you'}
                  formik={formik}
                  storeLocally={true}
                  help={'The most recently used address will be stored on device.'}
                  key={'location_donation'}
                />

                <ChoiceGroup
                  name="itemCondition"
                  label="Item Condition"
                  {...formik.getFieldProps('itemCondition')}
                  error={formik.touched.itemCondition && formik.errors.itemCondition ? formik.errors.itemCondition : ''}
                  onChange={(event) => {
                    formik.setFieldValue('itemCondition', event.target.value);
                  }}
                >
                  <Stack direction="row">
                    <Radio label="New" value={'New'} checked={'New' === formik.values.itemCondition} />
                    <Radio label="Used" value={'Used'} checked={'Used' === formik.values.itemCondition} />
                  </Stack>
                </ChoiceGroup>

                <Popover content={<CategoryListChoices />} noPadding preferredPosition="bottom" width="250px">
                  <InputField
                    disabled={formik.isSubmitting}
                    label="Categories"
                    name="categories"
                    error={formik.touched.categories && formik.errors.categories ? formik.errors.categories : ''}
                    tags={selectedCategories.length > 0 ? <SelectedCategoryTags /> : false}
                    help={
                      <div>
                        Select up to <strong>3</strong> categories
                      </div>
                    }
                  />
                </Popover>
              </Stack>
            </form>
          </CardSection>
        </Card>
      </Container>
    </>
  );
};

export default CreateDonationPanel;
