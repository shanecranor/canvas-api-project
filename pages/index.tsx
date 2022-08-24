import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'

const API_URL = "https://canvas.shanecranor.workers.dev/?req="
async function fetchCourseList() {
  const response = await fetch(
    `${API_URL}api/v1/courses?enrollment_state=active`
  );
  return (await response.json());
}
async function fetchAssignments(course_id: string) {
  const response = await fetch(
    `${API_URL}api/v1/courses/${course_id}/assignments?per_page=1000`
  );
  return (await response.json());
}
function parseAssignments(assignments: any, setAssignments: any, course_id: string){
  console.log(assignments)
  if(!assignments[course_id]){
    console.log(course_id)
    return <button onClick={async () => {
      const data = await fetchAssignments(course_id)
      setAssignments((old) => ({...old, [course_id]: data}))
    }}>
      Load Assignments
      </button>
  }
  return JSON.stringify(assignments[course_id])
}
function parseCourseList(courseList, assignments, setAssignments) {
  return courseList.map(
    (course: any) => {
      return (course?.course_code.includes("2022") && 
      <>
        <p>{course.name}{course.id}</p>
        {parseAssignments(assignments, setAssignments, course.id)}
      </>)
    }
  )
}
const Home: NextPage = () => {
  const [courseList, setCourseList] = useState();
  const [assignments, setAssignments] = useState({"40460": ["class", "youmom"]});
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <button onClick={async () => setCourseList(await fetchCourseList())}>get CourseList</button><br />
        {/* <button onClick={async () => setAssignments(await fetchAssignments("40233"))}>get Assignements</button> */}
        <br></br>
        {courseList ? parseCourseList(courseList, assignments, setAssignments) : "not loaded"}
        <br></br>
        {/* {assignments && <div dangerouslySetInnerHTML={{ __html: assignments[0].description }}></div>}
        {assignments ? JSON.stringify(assignments) : "not loaded"} */}

      </main>
    </>
  )
}

export default Home
